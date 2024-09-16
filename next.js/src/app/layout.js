import { Courier_Prime } from "next/font/google";
import "./style.css";

export const metadata = {
  title: "Chat App",
  description: "",
};

const font = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
