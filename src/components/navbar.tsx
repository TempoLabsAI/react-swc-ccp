import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { Button } from "./ui/button";

export function Navbar() {
  const { user, isLoaded } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const userData = useQuery(api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip"
  );
  const subscription = useQuery(api.subscriptions.getUserSubscription);

  useEffect(() => {
    if (user) {
      createOrUpdateUser();
    }
  }, [user, createOrUpdateUser]);

  return (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-base font-medium text-[#1D1D1F]">Tempo</span>
          </Link>

          <div className="flex-1"></div>

          {isLoaded ? (
            <div className="flex items-center gap-4">
              <Authenticated>
                <div className="hidden md:flex items-center gap-3">
                  <Link 
                    to="/dashboard" 
                    className="inline-flex items-center px-3.5 py-1.5 text-sm font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E5E5E5] rounded-full transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                  {subscription?.status === "active" && (
                    <Link 
                      to="/dashboard-paid" 
                      className="inline-flex items-center px-3.5 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-[#0066CC] to-[#0077ED] hover:from-[#0077ED] hover:to-[#0088FF] rounded-full transition-all duration-200 shadow-sm"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Pro Dashboard
                    </Link>
                  )}
                  <UserButton afterSignOutUrl="/" />
                </div>
              </Authenticated>
              <Unauthenticated>
                <SignInButton mode="modal" signUpFallbackRedirectUrl="/">
                  <Button 
                    variant="default"
                    className="h-8 px-4 text-sm rounded-[14px] bg-[#0066CC] hover:bg-[#0077ED] text-white shadow-sm transition-all"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </Unauthenticated>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 bg-[#F5F5F7] rounded-full animate-pulse"></div>
                <div className="h-8 w-8 rounded-full bg-[#F5F5F7] animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
