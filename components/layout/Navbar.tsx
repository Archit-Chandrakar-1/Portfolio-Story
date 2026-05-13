'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { RiMenuLine, RiCloseLine, RiAdminLine, RiSunLine, RiMoonLine } from 'react-icons/ri';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/products', label: 'Products' },
    { href: '/clients', label: 'Clients' },
    { href: '/certifications', label: 'Certifications' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/contact', label: 'Contact' },

];

function RocketAnimation() {
    const controls = useAnimationControls();
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;

        async function fly() {
            while (!cancelled) {
                await controls.set({ x: 0, opacity: 1, scale: 1 });
                await controls.start({
                    x: typeof window !== 'undefined' ? window.innerWidth * 0.78 : 900,
                    opacity: [1, 1, 0],
                    scale: [1, 1.2, 0.8],
                    transition: { duration: 2.2, ease: 'easeInOut' },
                });
                // Wait 4 seconds before re-launching
                await new Promise((r) => setTimeout(r, 4000));
            }
        }

        fly();
        return () => { cancelled = true; };
    }, [controls]);

    return (
        <motion.span
            animate={controls}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-lg pointer-events-none select-none z-20"
            style={{ originX: 0 }}
        >
            🚀
        </motion.span>
    );
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { isAdmin } = useAuth();
    const { theme, toggle } = useTheme();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/95 dark:bg-navy-dark/95 backdrop-blur-xl py-3 border-b border-border shadow-sm'
                : 'py-5 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo with rocket flying over it */}
                <Link href="/" className="flex items-center gap-2 group relative">
                    <RocketAnimation />
                    <div className="w-9 h-9 rounded-xl bg-navy dark:bg-lime flex items-center justify-center font-display font-bold text-sm text-lime dark:text-navy shadow-md transition-colors">
                        AC
                    </div>
                    <span className="font-display font-semibold text-navy dark:text-white hidden sm:block tracking-tight">
                        Archit
                        <span className="text-navy/50 dark:text-white/50 ml-1">Chandrakar</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                    ? 'text-navy dark:text-white'
                                    : 'text-navy dark:text-white/60 hover:text-navy dark:hover:text-white'
                                    }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-lime/30 dark:bg-lime/20 rounded-xl border border-lime/50"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                    />
                                )}
                                <span className="relative z-10">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <motion.button
                        onClick={toggle}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-white/10 border border-border dark:border-white/15 flex items-center justify-center text-navy dark:text-white/70 hover:border-lime/50 transition-all shadow-sm"
                        aria-label="Toggle theme"
                    >
                        <AnimatePresence mode="wait">
                            {theme === 'dark' ? (
                                <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <RiSunLine size={16} className="text-lime" />
                                </motion.span>
                            ) : (
                                <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <RiMoonLine size={16} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-navy dark:text-white bg-lime/20 border border-lime/40 hover:bg-lime/40 transition-all duration-200"
                        >
                            <RiAdminLine size={14} />
                            Admin
                        </Link>
                    )}
                    <Link
                        href="/contact"
                        className="hidden md:block btn-primary px-5 py-2 text-sm rounded-xl"
                    >
                        Let's Connect
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-xl bg-white dark:bg-white/10 border border-border dark:border-white/15 text-navy dark:text-white/70 hover:text-navy transition-colors shadow-sm"
                    >
                        {mobileOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden overflow-hidden bg-white/98 dark:bg-navy-dark/98 border-t border-border dark:border-white/10 shadow-md"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === link.href
                                        ? 'text-navy dark:text-white bg-lime/20 border border-lime/30'
                                        : 'text-navy dark:text-white/60 hover:text-navy dark:hover:text-white hover:bg-navy/5 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    onClick={() => setMobileOpen(false)}
                                    className="px-4 py-3 rounded-xl text-sm font-medium text-navy dark:text-white"
                                >
                                    Admin Panel
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
