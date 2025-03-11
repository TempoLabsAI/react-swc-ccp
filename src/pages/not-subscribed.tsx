import { PricingCard } from "@/components/pricing-card";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";

export default function NotSubscribed() {
    const getPlansAction = useAction(api.subscriptions.getPlansPolar);
    const [plans, setPlans] = useState<any>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const plansData = await getPlansAction();

                console.log("Plans:", plansData);
                setPlans(plansData);
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };
        fetchPlans();
    }, [getPlansAction]);

    if (!plans) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Upgrade Your Account
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Get access to all features by subscribing to one of our plans
                    </p>
                </div>

                <div className="mt-12 flex justify-center">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-7xl">
                        {plans.items.map((product) =>
                            product.prices.map((price) => (
                                <PricingCard
                                    key={`${product.id}-${price.id}`}
                                    price={price}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}