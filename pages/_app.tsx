import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useRef, useLayoutEffect } from "react";
import Script from "next/script";
import COLORS from "../theme/colors";
import {useThemeStore} from '../state/useThemeStore'
import { useFullscreen } from 'react-use';



function MyApp({ Component, pageProps }: AppProps) {
  const darkModeStatus = useThemeStore(state => state.darkModeStatus);
  const fullScreenStatus = useThemeStore(state => state.fullScreenStatus);
  const themeStatus: 'dark' | 'light' = darkModeStatus ? 'dark' : 'light';


	const theme = {
		theme: themeStatus,
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	};


  useEffect(() => {
		if (darkModeStatus) {
			document.documentElement.setAttribute('theme', 'dark');
		}
		return () => {
			document.documentElement.removeAttribute('theme');
		};
	}, [darkModeStatus]);

  const tempRef = useRef(null);
  useFullscreen(tempRef ,fullScreenStatus, {
		onClose: () => useThemeStore.setState({fullScreenStatus: false}),
	});

  useLayoutEffect(() => {
    document.body.classList.add('modern-design');
	});

  return (
    <>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
