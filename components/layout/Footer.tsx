'use client';
import Link from 'next/link';
import { RiLinkedinFill, RiTwitterXFill, RiInstagramLine, RiGithubFill, RiMailLine, RiWhatsappLine, RiMediumLine, RiExternalLinkLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/products', label: 'Products' },
    { href: '/certifications', label: 'Certifications' },
    { href: '/blogs', label: 'Blogs' },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-navy mt-20">
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-10 dot-pattern pointer-events-none" />

            {/* Lime top accent bar */}
            <div className="h-1 w-full bg-lime" />

            <div className="relative max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-lime flex items-center justify-center font-display font-bold text-sm text-navy">
                                AC
                            </div>
                            <span className="font-display font-semibold text-white">
                                Archit <span className="text-lime">Chandrakar</span>
                            </span>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            Product Manager crafting impactful digital experiences. Building products that matter.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h3>
                        <ul className="space-y-2">
                            {navLinks.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-white/50 text-sm hover:text-lime transition-colors duration-200">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h3>
                        <div className="flex gap-3 flex-wrap">
                            {[
                                { icon: RiLinkedinFill, href: 'https://linkedin.com', label: 'LinkedIn' },
                                { icon: RiTwitterXFill, href: 'https://twitter.com', label: 'Twitter' },
                                { icon: RiWhatsappLine, href: 'https://wa.me/91XXXXXXXXXX', label: 'WhatsApp' },
                                { icon: RiMediumLine, href: 'https://medium.com', label: 'Medium' },
                                { icon: RiExternalLinkLine, href: 'https://topmate.io', label: 'Topmate' },
                                { icon: RiInstagramLine, href: 'https://instagram.com', label: 'Instagram' },
                                { icon: RiGithubFill, href: 'https://github.com', label: 'GitHub' },
                                { icon: RiMailLine, href: 'mailto:archit@example.com', label: 'Email' },
                            ].map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target={href.startsWith('mailto') ? undefined : '_blank'}
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center text-white/50 hover:text-lime hover:border-lime/40 transition-colors duration-200"
                                    aria-label={label}
                                >
                                    <Icon size={16} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-xs">
                        © {year} Archit Chandrakar. All rights reserved.
                    </p>
                    <p className="text-white/30 text-xs">
                        Built with{' '}
                        <span className="text-lime font-medium">Next.js + Firebase</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
