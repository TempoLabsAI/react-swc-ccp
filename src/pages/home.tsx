import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useAction, useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

const FEATURES = [
  {
    icon: "⚡️",
    title: "React + Vite",
    description: "Lightning-fast development with modern tooling and instant HMR"
  },
  {
    icon: "🔐",
    title: "Clerk Auth",
    description: "Secure authentication and user management out of the box"
  },
  {
    icon: "🚀",
    title: "Convex BaaS",
    description: "Real-time backend with automatic scaling and TypeScript support"
  },
  {
    icon: "💳",
    title: "Polar.sh",
    description: "Seamless payment integration for your SaaS"
  }
] as const;

function App() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const storeUser = useMutation(api.users.store);
  const getPlansAction = useAction(api.subscriptions.getPlans);
  const subscriptionStatus = useQuery(api.subscriptions.getUserSubscriptionStatus);
  const [plans, setPlans] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      storeUser();
    }
  }, [user, storeUser]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await getPlansAction({
          organizationId: import.meta.env.VITE_POLAR_ORGANIZATION_ID
        });

        console.log("Plans:", plansData);
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, [getPlansAction]);

  const handleNavigation = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (subscriptionStatus?.hasActiveSubscription) {
      navigate('/dashboard');
    } else {
      document.getElementById('pricing')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [navigate, subscriptionStatus?.hasActiveSubscription]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
    </div>
  );
}

export default App;