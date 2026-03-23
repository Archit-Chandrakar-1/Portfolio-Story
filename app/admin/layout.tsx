'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Force dark class on <html> for all admin pages, restore on leave
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('dark');
        return () => {
            const saved = localStorage.getItem('theme');
            if (saved !== 'dark') {
                root.classList.remove('dark');
            }
        };
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/admin/login');
            } else if (!isAdmin && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        }
    }, [user, isAdmin, loading, router, pathname]);

    if (loading || (!isAdmin && pathname !== '/admin/login')) {
        return (
            <div className="dark min-h-screen flex items-center justify-center bg-navy-dark">
                <div className="w-8 h-8 border-2 border-lime border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (pathname === '/admin/login') {
        return (
            <div className="dark min-h-screen bg-navy-dark">
                {children}
            </div>
        );
    }

    return (
        <div className="dark min-h-screen flex bg-navy-dark text-white">
            <AdminSidebar />
            <main className="flex-1 ml-0 md:ml-64 p-6 pt-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
            <Toaster position="top-right" toastOptions={{ style: { background: '#0D1121', color: '#F1F5F9', border: '1px solid rgba(255,255,255,0.08)' } }} />
        </div>
    );
}
