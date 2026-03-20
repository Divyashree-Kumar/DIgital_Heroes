import "./globals.css";

export const metadata = {
  title: "Birdie For Good",
  description: "Golf charity subscription platform demo"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
