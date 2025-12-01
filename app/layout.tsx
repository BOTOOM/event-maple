import { ReactNode } from 'react';
import "./globals.css";

// El layout raíz es necesario, pero el contenido principal vive en [locale]/layout.tsx
export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
