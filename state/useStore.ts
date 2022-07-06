import create from "zustand";

interface DB {
  username: string;
}

const useSore = create<DB>()((set) => ({
  username: "sad",
}));
