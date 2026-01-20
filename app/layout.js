import { Playfair_Display, Comfortaa } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata = {
  title: "Dishly  - A Cozy Digital Cookbook",
  description: "Dishly is an accessible online index of dishes from all over the world. Discover, browse, and explore recipes from Filipino cuisine to international favorites in one cozy, easy-to-use platform.",
  keywords: "Dishly, recipes, recipe index, online cookbook, international dishes, Filipino cuisine, cooking, meal planner, recipe discovery, food database"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${comfortaa.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
