import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const submitForm = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const submissionId = await ctx.db.insert("formSubmissions", {
      name: args.name,
      email: args.email,
      message: args.message,
      status: "new",
      createdAt: Date.now(),
    });

    return submissionId;
  },
}); 