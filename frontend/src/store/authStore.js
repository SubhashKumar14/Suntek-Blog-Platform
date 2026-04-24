import { create } from "zustand";
import { api } from "../lib/apiClient";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  login: async (userCredWithRole) => {
    try {
      //set loading true
      set({ loading: true, error: null });
      //make api call
      const res = await api.post("/common-api/authenticate", userCredWithRole);
      // console.log("res is ", res);
      //update state
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload, //{message:"",payload:}
      });
    } catch (err) {
      console.log("err is ", err);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        //error: err,
        error: err.response?.data?.message || "Login failed",
      });
    }
  },
  logout: async () => {
    try {
      //set loading state
      set({ loading: true, error: null });
      //make logout api req
      await api.get("/common-api/logout");
      //update state
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || "Logout failed",
      });
    }
  },
  // restore login
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/common-api/check-auth");

      if (!res.data?.authenticated) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      // If user is not logged in → do nothing
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      // other errors
      console.error("Auth check failed:", err);
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));