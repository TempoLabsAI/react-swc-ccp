import { Button } from "@/components/ui/button";
import { Price } from "@/types/plans";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useAction } from "convex/react";
import { CheckCircle } from "lucide-react";
import { useCallback } from "react";
import { api } from "../../convex/_generated/api";

interface PricingCardProps {
  price: Price;
}

export function PricingCard({ price }: PricingCardProps) {
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
    <div className="group relative rounded-[32px] bg-white p-8 transition-all hover:scale-[1.02] hover:shadow-lg">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-neutral-50 rounded-[32px] -z-10" />

      {isYearly && (
        <div className="inline-flex items-center gap-2 rounded-[20px] bg-[#0066CC]/10 px-4 py-2 mb-6">
          <span className="text-sm font-medium text-[#0066CC]">
            Save 17%
          </span>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-[#1D1D1F] mb-2">
            {isYearly ? 'Yearly' : 'Monthly'}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-medium text-[#1D1D1F]">
              ${(price.amount / 100).toFixed(2)}
            </span>
            <span className="text-lg text-[#86868B]">/{price.interval}</span>
          </div>
        </div>

        <p className="text-base text-[#86868B] leading-relaxed">
          {isYearly ? 'Best value for long-term commitment' : 'Perfect for getting started with our platform'}
        </p>

        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#0066CC]" />
            <span className="text-base text-[#1D1D1F]">
              {price.interval === 'month' ? 'Full access to all features' : 'Everything in monthly'}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#0066CC]" />
            <span className="text-base text-[#1D1D1F]">
              {price.interval === 'month' ? 'Priority support' : '2 months free'}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#0066CC]" />
            <span className="text-base text-[#1D1D1F]">
              {price.interval === 'month' ? 'Regular updates' : 'Early access to new features'}
            </span>
          </li>
        </ul>

        {isLoaded && (
          <Authenticated>
            <Button
              className="w-full h-12 text-base rounded-[14px] bg-[#0066CC] hover:bg-[#0077ED] text-white shadow-sm transition-all"
              onClick={handleCheckout}
            >
              Get Started {isYearly ? 'Yearly' : 'Monthly'}
            </Button>
          </Authenticated>
        )}
        <Unauthenticated>
          <SignInButton mode="modal" signUpFallbackRedirectUrl="/">
            <Button className="w-full h-12 text-base rounded-[14px] bg-[#0066CC] hover:bg-[#0077ED] text-white shadow-sm transition-all">
              Get Started {isYearly ? 'Yearly' : 'Monthly'}
            </Button>
          </SignInButton>
        </Unauthenticated>
      </div>
    </div>
  );
}