import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { displayFont, sansFont, monoFont } from '@/styles/fonts';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Praktikumsverwaltung',
  description: 'Praktikumsmanagement für Schulen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
