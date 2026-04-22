import "./globals.css";

export const metadata = {
  title: "TF-IDF Text Summarizer",
  description: "Full-stack text summarization app using TF-IDF sentence scoring"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
