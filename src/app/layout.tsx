import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import CanvasBackground from '@/components/CanvasBackground';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Nirvanaa Studios | Cinematic Design & Digital Artistry',
  description: 'Nirvanaa Studios is a premium design and creative technology studio, crafting cinematic websites, interactive WebGL configurators, and luxury brand systems.',
  keywords: ['Nirvanaa Studios', 'Cinematic Web Design', 'Interactive 3D Websites', 'Brand Strategy', 'Brutalist Design', 'WebGL Configurator'],
  authors: [{ name: 'Nirvanaa Studios' }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Interactive Floating Particle Background Layer */}
        <CanvasBackground />
        
        {/* Sticky Glassmorphism Navigation Bar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
