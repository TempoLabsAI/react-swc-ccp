import { Navbar } from "@/components/navbar";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useAction, useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

function App() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const storeUser = useMutation(api.users.store);
  const getProCheckoutUrl = useAction(api.subscriptions.getProOnboardingCheckoutUrl);
  const storePlans = useAction(api.subscriptions.storePlans);
  const subscriptionStatus = useQuery(api.subscriptions.getUserSubscriptionStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      storeUser();
      storePlans();
    }
  }, [user, storeUser, storePlans]);


  const handleCheckout = async (interval: "month" | "year") => {
    try {
      const checkoutProUrl = await getProCheckoutUrl({
        interval
      });

      if (checkoutProUrl) {
        window.location.href = checkoutProUrl;
      }
    } catch (error) {
      console.error("Failed to get checkout URL:", error);
    }
  };

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (subscriptionStatus?.hasActiveSubscription) {
      navigate('/dashboard');
    } else {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };
  
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
              : <div className="flex gap-4">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <button className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200">
                      Get Started
                    </button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button
                    // variant="default"
                    className="text-sm font-medium"
                    onClick={handleNavigation}
                  >
                    {subscriptionStatus?.hasActiveSubscription ? 'Go to Dashboard' : 'View Pricing'}
                  </Button>
                </Authenticated>
              </div>}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-2">⚡️</div>
              <h3 className="text-lg font-semibold mb-2">React + Vite</h3>
              <p className="text-gray-600">Lightning-fast development with modern tooling and instant HMR</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-2">🔐</div>
              <h3 className="text-lg font-semibold mb-2">Clerk Auth</h3>
              <p className="text-gray-600">Secure authentication and user management out of the box</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="text-lg font-semibold mb-2">Convex BaaS</h3>
              <p className="text-gray-600">Real-time backend with automatic scaling and TypeScript support</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-2">💳</div>
              <h3 className="text-lg font-semibold mb-2">Polar.sh</h3>
              <p className="text-gray-600">Seamless payment integration for your SaaS</p>
            </div>
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly Plan */}
              <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">$12</span>
                    <span className="text-lg text-gray-600 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">Perfect for getting started with our platform</p>

                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Full access to all features
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Priority support
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Regular updates
                    </li>
                  </ul>

                  <Authenticated>
                    <Button
                      onClick={() => handleCheckout("month")}
                      className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors duration-200"
                    >
                      Get Started Monthly
                    </Button>
                  </Authenticated>
                  <Unauthenticated>
                    <SignInButton mode="modal">
                      <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors duration-200">
                        Get Started Monthly
                      </Button>
                    </SignInButton>
                  </Unauthenticated>
                </div>
              </div>

              {/* Yearly Plan */}
              <div className="relative bg-white border-2 border-indigo-600 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="absolute -top-4 right-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    Save 17%
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Yearly</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">$100</span>
                    <span className="text-lg text-gray-600 ml-1">/year</span>
                  </div>
                  <p className="text-gray-600 mb-6">Best value for long-term commitment</p>

                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Everything in monthly
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      2 months free
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Early access to new features
                    </li>
                  </ul>

                  <Authenticated>
                    <Button
                      onClick={() => handleCheckout("year")}
                      className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors duration-200"
                    >
                      Get Started Yearly
                    </Button>
                  </Authenticated>
                  <Unauthenticated>
                    <SignInButton mode="modal">
                      <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors duration-200">
                        Get Started Yearly
                      </Button>
                    </SignInButton>
                  </Unauthenticated>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;