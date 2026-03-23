'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { RiUserLine, RiBriefcaseLine, RiApps2Line, RiAwardLine, RiArticleLine, RiLinksLine, RiExternalLinkLine } from 'react-icons/ri';
import { useAuth } from '@/lib/AuthContext';

const SECTIONS = [
    { href: '/admin/about', icon: RiUserLine, label: 'About & Hero', desc: 'Edit your name, headline, bio, and profile photo', color: 'violet' },
    { href: '/admin/experience', icon: RiBriefcaseLine, label: 'Experience', desc: 'Manage your career timeline entries', color: 'cyan' },
    { href: '/admin/products', icon: RiApps2Line, label: 'Products', desc: 'Add, edit, or remove portfolio products', color: 'violet' },
    { href: '/admin/certifications', icon: RiAwardLine, label: 'Certifications', desc: 'Manage your credentials and badges', color: 'cyan' },
    { href: '/admin/blogs', icon: RiArticleLine, label: 'Blog Posts', desc: 'Write and publish product insights', color: 'violet' },
    { href: '/admin/socials', icon: RiLinksLine, label: 'Socials & Links', desc: 'Update social media accounts and links', color: 'cyan' },
];

export default function AdminDashboard() {
    const { user } = useAuth();
    const firstName = user?.displayName?.split(' ')[0] || 'Admin';

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
    };
    const item = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="pt-8 md:pt-0">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <h1 className="font-display font-black text-3xl text-text-primary mb-1">
                    Welcome back, <span className="gradient-text">{firstName}</span> 👋
                </h1>
                <p className="text-text-secondary text-sm">Manage your portfolio content from one place.</p>

                <div className="mt-4">
                    <a href="/" target="_blank" className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-violet-light transition-colors">
                        <RiExternalLinkLine size={12} />
                        View live portfolio
                    </a>
                </div>
            </motion.div>

            {/* Quick stats */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-5 border border-white/6 mb-8"
            >
                <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-4">Content Sections</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {SECTIONS.map(({ label, icon: Icon }) => (
                        <div key={label} className="text-center">
                            <Icon size={20} className="text-text-muted mx-auto mb-1" />
                            <p className="text-text-muted text-xs leading-tight">{label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Section cards */}
            <motion.div variants={container} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SECTIONS.map(({ href, icon: Icon, label, desc, color }) => (
                    <motion.div key={href} variants={item}>
                        <Link href={href}>
                            <div className="glass rounded-2xl p-6 border border-white/6 card-hover h-full flex flex-col gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === 'violet' ? 'bg-violet/15 border border-violet/20' : 'bg-cyan/15 border border-cyan/20'}`}>
                                    <Icon size={18} className={color === 'violet' ? 'text-violet-light' : 'text-cyan-light'} />
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-text-primary mb-1">{label}</h3>
                                    <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
