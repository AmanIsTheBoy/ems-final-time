import { create } from 'zustand';

const useAuthStore = create((set) => ({
  userEmail: '',
  setUserEmail: (email) => set({ userEmail: email }),
}));

export default useAuthStore;
