import "../styles/globals.css";
// import 'bootstrap/dist/js/bootstrap.bundle';
// import 'bootstrap/dist/css/bootstrap.css'
import "../styles/styles.scss";
import type { AppProps } from "next/app";





function MyApp({ Component, pageProps }: AppProps) {
 

  return (

        <Component {...pageProps} />
	);
}

export default MyApp;
