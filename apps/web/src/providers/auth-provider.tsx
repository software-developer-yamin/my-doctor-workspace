"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, setLoading } from "@/redux/slices/auth-slice";
import { CONSTANT } from "@/config/constant";

import { getCookie } from "cookies-next";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      dispatch(setLoading(true));
      try {
        if (typeof window !== "undefined") {
          const token = getCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN) as string | undefined;
          const userData = getCookie(CONSTANT.LOCAL_STORAGE_KEYS.USER_DATA) as string | undefined;

          if (token && userData) {
            dispatch(setCredentials({
              user: JSON.parse(decodeURIComponent(userData)),
              token: token,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to hydrate auth state:", error);
      } finally {
        dispatch(setLoading(false));
        setMounted(true);
      }
    };

    hydrate();
  }, [dispatch]);

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return null; // Or a full page loader
  }

  return <>{children}</>;
}
