import { create } from 'zustand';
import axios from 'axios';
import { persist} from 'zustand/middleware';
import { axiosInstance} from './axios';

axios.defaults.withCredentials = true;

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      isLoading: false,
      error: null,
      isCheckingAuth: true,

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get('/api/auth/check');
          set ({ authUser: res.data});

        } catch (error){
          console.log('Error in CheckAuth:', error);
          set({ authUser: null});
        } finally {
          set({ isCheckingAuth: false});
        }
      },

      login: async (username, password) => {
        set({ isLoading: true, error: null});
        try {
          const res = await axiosInstance.post(`${BACKEND}/api/auth/login`,{
            username,
            password,
          });
          set({ authUser: res.data.user, isLoading: false });
          return res.data;
        } catch (error){
          console.error('Error in login', error);
          set({ error: error.response?.data?.message || 'Login Failed', isLoading: false,});
          throw error;
        }
      }

    }),
     {
      name: 'auth-storage',
      partialize: (state) => ({ authUser: state.authUser }),
    }
  )
)