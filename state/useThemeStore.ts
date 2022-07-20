import create from "zustand";

interface ThemeTypes {
  asideStatus: boolean;
	darkModeStatus: boolean;
	fullScreenStatus: boolean;
	leftMenuStatus: boolean;
	mobileDesign: boolean;
	rightMenuStatus: boolean;
	rightPanel: boolean;
	setAsideStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setDarkModeStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setFullScreenStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setLeftMenuStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setRightMenuStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setRightPanel: (value: ((prevState: boolean) => boolean) | boolean) => void;
}


export const useThemeStore = create<ThemeTypes>()((set) => ({
  asideStatus: true,
	darkModeStatus: false,
	fullScreenStatus: false,
	leftMenuStatus: true,
	mobileDesign: false,
	rightMenuStatus: false,
	rightPanel: false,
  setAsideStatus: () => set((state)=> ({asideStatus: !state.asideStatus})),
	setDarkModeStatus: () => set((state)=> ({darkModeStatus: !state.darkModeStatus})),
	setFullScreenStatus: () => set((state)=> ({fullScreenStatus: !state.fullScreenStatus})),
	setLeftMenuStatus: () => set((state)=> ({leftMenuStatus: !state.leftMenuStatus})),
	setRightMenuStatus: () => set((state)=> ({rightMenuStatus: !state.rightMenuStatus})),
	setRightPanel: () => set((state)=> ({rightPanel: !state.rightPanel}))
}));

