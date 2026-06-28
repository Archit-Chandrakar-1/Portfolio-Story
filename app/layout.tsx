import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import PublicShell from '@/components/layout/PublicShell';

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
        <html lang="en" className="scroll-smooth">
            <body className="bg-bg min-h-screen overflow-x-hidden">
                <AuthProvider>
                    <PublicShell>{children}</PublicShell>
                </AuthProvider>
            </body>
        </html>
    );
}
