// src/Store/EmployeeStore.js
import { create } from "zustand";

const useEmployeeStore = create((set) => ({
  employee: null,
  profilePicture: null,
  setEmployee: (empData, userEmail) => {
    const currentUser = Array.isArray(empData)
      ? empData.find((e) => e.email === userEmail)
      : empData;
    set({ employee: currentUser });
  },
  setProfilePicture: (imgUrl) => set({ profilePicture: imgUrl }),
}));

export default useEmployeeStore;
