import create from "zustand";

interface User {
  username: string;
  email: string;
  setUserState: (email: string, username?: string) => void;
}

// Set(state => {...}) -> use state if you want access to prev state
// If not, set({...}) directly will suffice
export const useUserStore = create<User>()((set) => ({
  username: "",
  email: "",

  setUserState: (email: string, username?: string): void => {
    set({
      username: username,
      email: email,
    });
  },
}));
