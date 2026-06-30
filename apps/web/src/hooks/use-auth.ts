import { useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout as logoutAction } from "@/redux/slices/auth-slice";
import { useRouter } from "next/navigation";
import { CONSTANT } from "@/config/constant";

import { deleteCookie } from "cookies-next";

export const useAuth = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const logout = () => {
    queryClient.clear();
    dispatch(logoutAction());
    if (typeof window !== "undefined") {
      deleteCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      deleteCookie("my-doctor-refresh-token");
      deleteCookie(CONSTANT.LOCAL_STORAGE_KEYS.USER_DATA);
    }
    router.push("/");
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    logout,
  };
};
