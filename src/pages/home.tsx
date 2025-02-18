import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useAction, useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              Tempo React Starter
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-8">
              Launch your next project faster with our modern tech stack: React + Vite, Clerk Auth, Convex BaaS, and Polar.sh payments.
            </p>

            {!isUserLoaded ?
              <div className="flex gap-4">
                <div className="px-8 py-3 w-[145px] h-[38px] rounded-lg bg-gray-200 animate-pulse"></div>
              </div>
              :
              <div className="flex justify-center items-center gap-4">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200">
                      Get Started
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button>
                    <Link to="/dashboard">Go to Dashboard (Non paid)</Link>
                  </Button>
                  <Button
                    className="text-sm font-medium"
                  >
                    <Link to="/dashboard-paid">Go to Dashboard (Paid)</Link>
                  </Button>
                </Authenticated>
              </div>}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {FEATURES.map(feature => (
              <div key={feature.title} className="p-6 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans?.items?.map((product: any) => (
                product.prices.map((price: any) => (
                  <PricingCard
                    key={price.id}
                    price={price}
                    product={product}
                  />
                ))
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;