import "./globals.css";

export const metadata = {
  title: "AI Grant Proposal Writer",
  description: "Generate grant proposals with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
