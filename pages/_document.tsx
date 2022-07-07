// In _document.js
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://apis.google.com/js/api.js"
          strategy="beforeInteractive"
        ></Script>
      </body>
    </Html>
  );
}
