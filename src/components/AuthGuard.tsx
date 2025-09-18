"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean; // true = private routes, false = public-only (login/signup)
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (requireAuth && !token) {
            // Private route but no token → redirect to login
            router.replace("/");
        }

        if (!requireAuth && token) {
            // Public route but already logged in → redirect to dashboard
            router.replace("/dashboard");
        }
    }, [requireAuth, router]);

    return <>{children}</>;
}
