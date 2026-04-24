"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/features/store/authSlice"; // Make sure path is correct

export default function AuthChecker({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // 1. RE-HYDRATION LOGIC
    // When the app loads, check if we have a token but aren't "authenticated" in Redux yet
    const token = localStorage.getItem("token");
    
    if (token && !isAuthenticated) {
      // In a real app, you'd call a /me API here. 
      // For now, we'll assume the token is valid and let the state catch up.
      // If you stored the user object in localStorage too, you could dispatch it here.
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        dispatch(setUser(JSON.parse(savedUser)));
      }
    }

    setIsReady(true);
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isReady) return;

    // 2. THE BOUNCER LOGIC
    // If no token exists in storage AND not authenticated in Redux
    const hasToken = typeof window !== 'undefined' && localStorage.getItem("token");

    if (!isAuthenticated && !hasToken && !isPublicRoute) {
      console.log("No token, redirecting to login");
      router.replace("/login");
      return;
    }

    // 3. THE REDIRECT LOGIC
    if (isAuthenticated && isPublicRoute) {
      console.log("Authenticated, moving to dashboard");
      // Use roleId to route
      const target = user?.roleId === 1 || user?.roleId === 2 ? '/admin/dashboard' : '/dashboard';
      router.replace(target);
      return;
    }
  }, [isAuthenticated, pathname, router, isPublicRoute, isReady, user]);

  // Loading state
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}