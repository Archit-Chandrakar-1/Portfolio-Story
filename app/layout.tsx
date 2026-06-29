import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import PublicShell from '@/components/layout/PublicShell';

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-inter',
    display: 'swap',
});

const outfit = Outfit({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-outfit',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Archit Chandrakar — Product Manager',
    description: 'Product Manager passionate about building impactful digital products. Explore my work, experience, and ideas.',
    keywords: ['Product Manager', 'PM Portfolio', 'Product Strategy', 'UX', 'Archit Chandrakar'],
    openGraph: {
        title: 'Archit Chandrakar — Product Manager',
        description: 'Storytelling through products. Explore my portfolio, certifications, and insights.',
        type: 'website',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`scroll-smooth ${inter.variable} ${outfit.variable}`}>
            <body className="bg-bg min-h-screen overflow-x-hidden">
                <AuthProvider>
                    <PublicShell>{children}</PublicShell>
                </AuthProvider>
            </body>
        </html>
    );
}
