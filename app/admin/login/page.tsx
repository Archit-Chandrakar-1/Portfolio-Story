'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiGoogleFill } from 'react-icons/ri';
import { useAuth } from '@/lib/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLoginPage() {
    const { user, isAdmin, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            if (isAdmin) {
                router.push('/admin');
            }
        }
    }, [user, isAdmin, loading, router]);

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch {
            toast.error('Sign-in failed. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-10 border border-red-500/20 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">🚫</div>
                    <h1 className="font-display font-bold text-xl text-text-primary mb-2">Access Denied</h1>
                    <p className="text-text-secondary text-sm mb-6">This account (<strong className="text-text-primary">{user.email}</strong>) is not authorized to access the admin panel.</p>
                    <button onClick={() => useAuth().signOut()} className="btn-secondary px-6 py-2.5 text-sm rounded-xl w-full">Sign Out</button>
                </motion.div>
                <Toaster position="top-center" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-1/4 -left-40 w-80 h-80 bg-violet/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-cyan/15 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="glass rounded-3xl p-10 border border-white/8 max-w-md w-full"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet to-cyan flex items-center justify-center font-display font-bold text-2xl text-white shadow-lg glow-violet mx-auto mb-4">
                        AC
                    </div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">Admin Panel</h1>
                    <p className="text-text-secondary text-sm mt-1">Sign in with your Google account to manage content</p>
                </div>

                {/* Sign in button */}
                <motion.button
                    onClick={handleSignIn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3.5 px-6 rounded-2xl text-sm hover:bg-gray-50 transition-colors shadow-lg"
                >
                    <RiGoogleFill size={18} className="text-[#4285F4]" />
                    Continue with Google
                </motion.button>

                <p className="text-text-muted text-xs text-center mt-6">
                    Only authorized accounts can access the admin panel.
                </p>
            </motion.div>

            <Toaster position="top-center" />
        </div>
    );
}
