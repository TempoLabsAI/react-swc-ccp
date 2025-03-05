import { Polar } from "@polar-sh/sdk";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import {
    action,
    httpAction,
    internalAction,
    internalMutation,
    internalQuery,
    mutation,
    query
} from "./_generated/server";
import {
  Webhook,
  WebhookVerificationError
} from "standardwebhooks";

import schema from "./schema";

const createCheckout = async ({
    customerEmail,
    productPriceId,
    successUrl,
    metadata
}: {
    customerEmail: string;
    productPriceId: string;
    successUrl: string;
    metadata?: Record<string, string>;
}) => {

    if (!process.env.POLAR_ACCESS_TOKEN) {
        throw new Error("POLAR_ACCESS_TOKEN is not configured");
    }

    const polar = new Polar({
        server: "sandbox",
        accessToken: process.env.POLAR_ACCESS_TOKEN,
    });

    console.log("Initialized Polar SDK with token:", process.env.POLAR_ACCESS_TOKEN?.substring(0, 8) + "...");

    const result = await polar.checkouts.custom.create({
        productPriceId,
        successUrl,
        customerEmail,
        metadata: {
            userId: metadata?.userId
        }
    });

    return result;
};

export const getPlansPolar = action({
    handler: async (ctx) => {
        const polar = new Polar({
            server: "sandbox",
            accessToken: process.env.POLAR_ACCESS_TOKEN,
        });

        const { result } = await polar.products.list({
            organizationId: process.env.POLAR_ORGANIZATION_ID
        });

        // Transform the data to remove Date objects and keep only needed fields
        const cleanedItems = result.items.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            isRecurring: item.isRecurring,
            prices: item.prices.map((price: any) => ({
                id: price.id,
                amount: price.priceAmount,
                currency: price.priceCurrency,
                interval: price.recurringInterval
            }))
        }));

        return {
            items: cleanedItems,
            pagination: result.pagination
        };
    },
});

export const getPlanByKey = internalQuery({
    args: {
        key: schema.tables.plans.validator.fields.key,
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("plans")
            .withIndex("key", (q) => q.eq("key", args.key))
            .unique();
    },
});

// Add these new mutations to handle plan creation and updates
export const createPlan = internalMutation({
    args: {
        description: v.string(),
        key: v.string(),
        name: v.string(),
        polarProductId: v.string(),
        prices: v.object({
            month: v.object({
                usd: v.optional(v.union(
                    v.object({
                        amount: v.number(),
                        polarId: v.string()
                    }),
                    v.null()
                ))
            }),
            year: v.object({
                usd: v.optional(v.union(
                    v.object({
                        amount: v.number(),
                        polarId: v.string()
                    }),
                    v.null()
                ))
            })
        })
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("plans", args);
    },
});

export const updatePlan = internalMutation({
    args: {
        id: v.id("plans"),
        description: v.string(),
        name: v.string(),
        polarProductId: v.string(),
        prices: v.object({
            month: v.object({
                usd: v.optional(v.union(
                    v.object({
                        amount: v.number(),
                        polarId: v.string()
                    }),
                    v.null()
                ))
            }),
            year: v.object({
                usd: v.optional(v.union(
                    v.object({
                        amount: v.number(),
                        polarId: v.string()
                    }),
                    v.null()
                ))
            })
        })
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        return await ctx.db.patch(id, updates);
    },
});

export const storePlans = action({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const polar = new Polar({
            server: "sandbox",
            accessToken: process.env.POLAR_ACCESS_TOKEN,
        });

        const { result } = await polar.products.list({
            organizationId: process.env.POLAR_ORGANIZATION_ID
        });

        // console.log("Products:", result);
        // Process each product and store in plans table
        for (const product of result.items) {
            // Find the prices once to avoid multiple lookups
            const monthlyPrice: any = product.prices.find((p: any) => p.recurringInterval === 'month' && p.priceCurrency === 'usd');
            const yearlyPrice: any = product.prices.find((p: any) => p.recurringInterval === 'year' && p.priceCurrency === 'usd');

            // Build the prices object with empty objects as defaults
            const prices = {
                month: {
                    usd: monthlyPrice ? {
                        amount: monthlyPrice.priceAmount,
                        polarId: monthlyPrice.id
                    } : {}
                },
                year: {
                    usd: yearlyPrice ? {
                        amount: yearlyPrice.priceAmount,
                        polarId: yearlyPrice.id
                    } : {}
                }
            };

            // Generate a key from the product name (lowercase, remove spaces)
            const key = product.name.toLowerCase().replace(/\s+/g, '-');

            // Check if plan already exists
            const existingPlan = await ctx.runQuery(internal.subscriptions.getPlanByKey, { key });

            if (existingPlan) {
                // Update existing plan
                await ctx.runMutation(internal.subscriptions.updatePlan, {
                    id: existingPlan._id,
                    description: product.description || "",
                    name: product.name,
                    polarProductId: product.id,
                    prices: prices as any
                });
            } else {
                // Insert new plan
                await ctx.runMutation(internal.subscriptions.createPlan, {
                    description: product.description || "",
                    key,
                    name: product.name,
                    polarProductId: product.id,
                    prices: prices as any
                });
            }
        }

        return { success: true, message: "Plans stored successfully" };
    },
});


export const getProOnboardingCheckoutUrl = action({
    args: {
        priceId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const user = await ctx.runQuery(api.users.getUserByToken, {
            tokenIdentifier: identity.subject
        });

        if (!user) {
            throw new Error("User not found");
        }

        const checkout = await createCheckout({
            customerEmail: user.email,
            productPriceId: args.priceId,
            successUrl: `${process.env.FRONTEND_URL}/success`,
            metadata: {
                userId: user.tokenIdentifier
            }
        });

        return checkout.url;
    },
});

export const getUserSubscriptionStatus = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { hasActiveSubscription: false };
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.subject)
            )
            .unique();

        if (!user) {
            return { hasActiveSubscription: false };
        }

        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("userId", (q) => q.eq("userId", user.tokenIdentifier))
            .first();

        const hasActiveSubscription = subscription?.status === "active";
        return { hasActiveSubscription };
    }
});

export const getUserSubscription = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.subject)
            )
            .unique();

        if (!user) {
            return null;
        }

        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("userId", (q) => q.eq("userId", user.tokenIdentifier))
            .first();

        return subscription;
    }
});

export const subscriptionStoreWebhook = mutation({
    args: {
        body: v.any(),
    },
    handler: async (ctx, args) => {

        // Extract event type from webhook payload
        const eventType = args.body.type;

        // Store webhook event
        await ctx.db.insert("webhookEvents", {
            type: eventType,
            polarEventId: args.body.data.id,
            createdAt: args.body.data.created_at,
            modifiedAt: args.body.data.modified_at || args.body.data.created_at,
            data: args.body.data,
        });

        switch (eventType) {
            case 'subscription.created':
                console.log("subscription.created:", args.body);

                // Insert new subscription
                await ctx.db.insert("subscriptions", {
                    polarId: args.body.data.id,
                    polarPriceId: args.body.data.price_id,
                    currency: args.body.data.currency,
                    interval: args.body.data.recurring_interval,
                    userId: args.body.data.metadata.userId,
                    status: args.body.data.status,
                    currentPeriodStart: new Date(args.body.data.current_period_start).getTime(),
                    currentPeriodEnd: new Date(args.body.data.current_period_end).getTime(),
                    cancelAtPeriodEnd: args.body.data.cancel_at_period_end,
                    amount: args.body.data.amount,
                    startedAt: new Date(args.body.data.started_at).getTime(),
                    endedAt: args.body.data.ended_at
                        ? new Date(args.body.data.ended_at).getTime()
                        : undefined,
                    canceledAt: args.body.data.canceled_at
                        ? new Date(args.body.data.canceled_at).getTime()
                        : undefined,
                    customerCancellationReason: args.body.data.customer_cancellation_reason || undefined,
                    customerCancellationComment: args.body.data.customer_cancellation_comment || undefined,
                    metadata: args.body.data.metadata || {},
                    customFieldData: args.body.data.custom_field_data || {},
                    customerId: args.body.data.customer_id
                });
                break;

            case 'subscription.updated':
                console.log("subscription.updated:", args.body);

                // Find existing subscription
                const existingSub = await ctx.db
                    .query("subscriptions")
                    .withIndex("polarId", (q) => q.eq("polarId", args.body.data.id))
                    .first();

                if (existingSub) {
                    await ctx.db.patch(existingSub._id, {
                        amount: args.body.data.amount,
                        status: args.body.data.status,
                        currentPeriodStart: new Date(args.body.data.current_period_start).getTime(),
                        currentPeriodEnd: new Date(args.body.data.current_period_end).getTime(),
                        cancelAtPeriodEnd: args.body.data.cancel_at_period_end,
                        metadata: args.body.data.metadata || {},
                        customFieldData: args.body.data.custom_field_data || {},
                    });
                }
                break;

            case 'subscription.active':
                console.log("subscription.active:", args.body);

                // Find and update subscription
                const activeSub = await ctx.db
                    .query("subscriptions")
                    .withIndex("polarId", (q) => q.eq("polarId", args.body.data.id))
                    .first();

                if (activeSub) {
                    await ctx.db.patch(activeSub._id, {
                        status: args.body.data.status,
                        startedAt: new Date(args.body.data.started_at).getTime(),
                    });
                }
                break;

            case 'subscription.canceled':
                console.log("subscription.canceled:", args.body);

                // Find and update subscription
                const canceledSub = await ctx.db
                    .query("subscriptions")
                    .withIndex("polarId", (q) => q.eq("polarId", args.body.data.id))
                    .first();

                if (canceledSub) {
                    await ctx.db.patch(canceledSub._id, {
                        status: args.body.data.status,
                        canceledAt: args.body.data.canceled_at
                            ? new Date(args.body.data.canceled_at).getTime()
                            : undefined,
                        customerCancellationReason: args.body.data.customer_cancellation_reason || undefined,
                        customerCancellationComment: args.body.data.customer_cancellation_comment || undefined,
                    });
                }
                break;

            case 'subscription.uncanceled':
                console.log("subscription.uncanceled:", args.body);

                // Find and update subscription
                const uncanceledSub = await ctx.db
                    .query("subscriptions")
                    .withIndex("polarId", (q) => q.eq("polarId", args.body.data.id))
                    .first();

                if (uncanceledSub) {
                    await ctx.db.patch(uncanceledSub._id, {
                        status: args.body.data.status,
                        cancelAtPeriodEnd: false,
                        canceledAt: undefined,
                        customerCancellationReason: undefined,
                        customerCancellationComment: undefined,
                    });
                }
                break;

            case 'subscription.revoked':
                console.log("subscription.revoked:", args.body);

                // Find and update subscription
                const revokedSub = await ctx.db
                    .query("subscriptions")
                    .withIndex("polarId", (q) => q.eq("polarId", args.body.data.id))
                    .first();

                if (revokedSub) {
                    await ctx.db.patch(revokedSub._id, {
                        status: 'revoked',
                        endedAt: args.body.data.ended_at
                            ? new Date(args.body.data.ended_at).getTime()
                            : undefined,
                    });
                }
                break;

            case 'order.created':
                console.log("order.created:", args.body);
                // Orders are handled through the subscription events
                break;

            default:
                console.log(`Unhandled event type: ${eventType}`);
                break;
        }
    },
});


// Use our own validation similar to validateEvent from @polar-sh/sdk/webhooks
// The only diffference is we use btoa to encode the secret since Convex js runtime doesn't support Buffer
const validateEvent = (
  body: string | Buffer,
  headers: Record<string, string>,
  secret: string,
) => {
  const base64Secret = btoa(secret);
  const webhook = new Webhook(base64Secret);
  webhook.verify(body, headers);
};


export const paymentWebhook = httpAction(async (ctx, request) => {
    try {
        const rawBody = await request.text();

        // Internally validateEvent uses headers as a dictionary e.g. headers["webhook-id"]
        // So we need to convert the headers to a dictionary 
        // (request.headers is a Headers object which is accessed as request.headers.get("webhook-id"))
        const headers: Record<string, string> = {};
        request.headers.forEach((value, key) => {
          headers[key] = value;
        });

        // Validate the webhook event
        validateEvent(
            rawBody,
            headers,
            process.env.POLAR_WEBHOOK_SECRET ?? '',
        )

        const body = JSON.parse(rawBody);

        // track events and based on events store data
        await ctx.runMutation(api.subscriptions.subscriptionStoreWebhook, {
            body
        });

        console.log("Webhook body:", body);
        return new Response(JSON.stringify({ message: "Webhook received!" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        if (error instanceof WebhookVerificationError) {
            console.log("Webhook verification failed", error);
            return new Response(JSON.stringify({ message: "Webhook verification failed" }), {
                status: 403,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        console.log("Webhook failed", error);
        return new Response(JSON.stringify({ message: "Webhook failed" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

});

export const getUserDashboardUrl = action({
    handler: async (ctx, args: { customerId: string }) => {
        const polar = new Polar({
            server: "sandbox",
            accessToken: process.env.POLAR_ACCESS_TOKEN,
        });

        try {
            const result = await polar.customerSessions.create({
                customerId: args.customerId,
            });

            // Only return the URL to avoid Convex type issues
            return { url: result.customerPortalUrl };
        } catch (error) {
            console.error("Error creating customer session:", error);
            throw new Error("Failed to create customer session");
        }
    }
});
