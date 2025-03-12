import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bredware Surveillance Dashboard",
  description: "Virtual meeting platform with private rooms",
  icons: {
    icon: "/bw.webp", // Path to favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
