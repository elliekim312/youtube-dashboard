import './globals.css';

export const metadata = {
  title: 'YouTube Dashboard',
  description: 'Dashboard for YouTube Content Creators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}