'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    RiDashboardLine, RiUserLine, RiBriefcaseLine, RiApps2Line,
    RiAwardLine, RiArticleLine, RiLinksLine, RiLogoutBoxLine, RiMenuLine, RiCloseLine
} from 'react-icons/ri';

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: RiDashboardLine },
    { href: '/admin/about', label: 'About & Hero', icon: RiUserLine },
    { href: '/admin/experience', label: 'Experience', icon: RiBriefcaseLine },
    { href: '/admin/products', label: 'Products', icon: RiApps2Line },
    { href: '/admin/certifications', label: 'Certifications', icon: RiAwardLine },
    { href: '/admin/blogs', label: 'Blog Posts', icon: RiArticleLine },
    { href: '/admin/socials', label: 'Socials & Links', icon: RiLinksLine },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const SidebarContent = () => (
        <div className="h-full flex flex-col py-6">
            {/* Brand */}
            <div className="px-4 mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet to-cyan flex items-center justify-center font-display font-bold text-xs text-white">
                        AC
                    </div>
                    <div>
                        <p className="text-text-primary text-sm font-semibold">{user?.displayName || 'Admin'}</p>
                        <p className="text-text-muted text-xs">{user?.email}</p>
                    </div>
                </div>
            </div>

            <p className="text-text-muted text-xs font-semibold uppercase tracking-wider px-4 mb-2">Content</p>

            {/* Nav */}
            <nav className="flex-1 px-2 space-y-0.5">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                    ? 'bg-violet/15 text-violet-light border border-violet/20'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Sign out */}
            <div className="px-2 mt-4 border-t border-white/5 pt-4">
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 w-full"
                >
                    <RiLogoutBoxLine size={16} />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:block fixed left-0 top-0 h-full w-64 glass-strong border-r border-white/5 z-40">
                <SidebarContent />
            </aside>

            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 glass border border-white/10 rounded-xl text-text-secondary"
            >
                {mobileOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
            </button>

            {/* Mobile sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/60 z-40"
                        />
                        <motion.aside
                            initial={{ x: -260 }}
                            animate={{ x: 0 }}
                            exit={{ x: -260 }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="md:hidden fixed left-0 top-0 h-full w-64 glass-strong border-r border-white/5 z-50"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
