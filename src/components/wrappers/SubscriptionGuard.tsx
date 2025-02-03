import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

interface SubscriptionGuardProps {
    children: ReactNode;
    fallbackUrl?: string;
}

export function SubscriptionGuard({
    children,
    fallbackUrl = '/'
}: SubscriptionGuardProps) {
    const { user } = useUser();
    const navigate = useNavigate();
    const subscriptionStatus = useQuery(api.subscriptions.getUserSubscriptionStatus);

    useEffect(() => {
        // If no subscription data or no active subscription, redirect
        if (!user || !subscriptionStatus?.hasActiveSubscription) {
            navigate(fallbackUrl);
        }
    }, [user, subscriptionStatus, navigate, fallbackUrl]);

    // Only render children if we have an active subscription
    if (!user || !subscriptionStatus?.hasActiveSubscription) {
        return null;
    }

    return <>{children}</>;
}
