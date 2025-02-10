import { SignInButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useAction } from "convex/react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { Price, Product } from "@/types/plans";

interface PricingCardProps {
  price: Price;
  product: Product;
}

export function PricingCard({ price, product }: PricingCardProps) {
  const { isLoaded } = useUser();
  const getProCheckoutUrl = useAction(api.subscriptions.getProOnboardingCheckoutUrl);

  const handleCheckout = useCallback(async () => {
    try {
      const checkoutProUrl = await getProCheckoutUrl({ priceId: price.id });
      if (checkoutProUrl) window.location.href = checkoutProUrl;
    } catch (error) {
      console.error("Failed to get checkout URL:", error);
    }
  }, [getProCheckoutUrl, price.id]);

  const isYearly = price.interval === 'year';

  return (
    <div className={`relative bg-white border ${
      isYearly ? 'border-2 border-indigo-600' : 'border-gray-200'
    } rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300`}>
      {isYearly && (
        <div className="absolute -top-4 right-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
            Save 17%
          </span>
        </div>
      )}
      <div className="p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isYearly ? 'Yearly' : 'Monthly'}
        </h3>
        <div className="flex items-baseline mb-4">
          <span className="text-5xl font-bold tracking-tight text-gray-900">
            ${(price.amount / 100).toFixed(2)}
          </span>
          <span className="text-lg text-gray-600 ml-1">/{price.interval}</span>
        </div>
        <p className="text-gray-600 mb-6">
          {isYearly ? 'Best value for long-term commitment' : 'Perfect for getting started with our platform'}
        </p>

        <ul className="space-y-4 text-gray-600">
          <li className="flex items-center">
            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {price.interval === 'month' ? 'Full access to all features' : 'Everything in monthly'}
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {price.interval === 'month' ? 'Priority support' : '2 months free'}
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {price.interval === 'month' ? 'Regular updates' : 'Early access to new features'}
          </li>
        </ul>

        {isLoaded && (
          <Authenticated>
            <Button
              className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors duration-200"
              onClick={handleCheckout}
            >
              Get Started {isYearly ? 'Yearly' : 'Monthly'}
            </Button>
          </Authenticated>
        )}
        <Unauthenticated>
          <SignInButton mode="modal">
            <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors duration-200">
              Get Started {isYearly ? 'Yearly' : 'Monthly'}
            </Button>
          </SignInButton>
        </Unauthenticated>
      </div>
    </div>
  );
} 