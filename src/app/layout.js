import { Roboto, Roboto_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Turkish Shawarma Phnom Penh",
  description: "Authentic Turkish Shawarma & Fast Food in Phnom Penh, Cambodia. Order Online Now!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-KNGMRVKLGN"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KNGMRVKLGN');
          `}
        </Script>
      </head>
      <body className={`${roboto.variable} ${robotoMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
