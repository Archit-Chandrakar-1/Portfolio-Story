'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiMailSendLine,
    RiLinkedinFill,
    RiTwitterXLine,
    RiGithubLine,
    RiMapPinLine,
    RiCheckboxCircleLine,
    RiSendPlaneLine,
} from 'react-icons/ri';

const SOCIAL = [
    { icon: RiLinkedinFill, label: 'LinkedIn', href: 'https://linkedin.com/in/archit-chandrakar', color: 'text-sky-400' },
    { icon: RiTwitterXLine, label: 'X / Twitter', href: 'https://twitter.com/', color: 'text-text-secondary' },
    { icon: RiGithubLine, label: 'GitHub', href: 'https://github.com/', color: 'text-text-secondary' },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate async send (wire up your backend/email service here)
        await new Promise(r => setTimeout(r, 1400));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* ─── Header ───────────────────────────────────────── */}
                <div className="text-center mb-16">
                    <span className="glass border border-violet/30 text-violet-light text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-4 inline-block">
                        Contact
                    </span>
                    <h1 className="font-display font-black text-4xl sm:text-5xl text-white mt-4">
                        Let's <span className="gradient-text">Connect</span>
                    </h1>
                    <p className="text-white/70 mt-4 max-w-xl mx-auto text-base leading-relaxed">
                        Have a product idea, collaboration opportunity, or just want to say hi?
                        I'd love to hear from you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-10 items-start">
                    {/* ─── Left: Info ──────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact info card */}
                        <div className="glass rounded-3xl p-8 border border-white/6">
                            <h2 className="font-display font-bold text-lg text-text-primary mb-6">Get in touch</h2>
                            <div className="space-y-5">
                                <a
                                    href="mailto:archit@example.com"
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet/20 to-cyan/10 border border-white/8 flex items-center justify-center shrink-0 group-hover:border-violet/40 transition-colors">
                                        <RiMailSendLine size={18} className="text-violet-light" />
                                    </div>
                                    <div>
                                        <p className="text-text-muted text-xs mb-0.5">Email</p>
                                        <p className="text-text-primary text-sm font-medium group-hover:text-violet-light transition-colors">
                                            archit1chandrakar@gmail.com
                                        </p>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/10 border border-white/8 flex items-center justify-center shrink-0">
                                        <RiMapPinLine size={18} className="text-cyan-light" />
                                    </div>
                                    <div>
                                        <p className="text-text-muted text-xs mb-0.5">Location</p>
                                        <p className="text-text-primary text-sm font-medium">India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="glass rounded-3xl p-8 border border-white/6">
                            <h2 className="font-display font-bold text-lg text-text-primary mb-6">Find me online</h2>
                            <div className="space-y-3">
                                {SOCIAL.map(({ icon: Icon, label, href, color }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/8"
                                    >
                                        <Icon size={18} className={`${color} group-hover:scale-110 transition-transform`} />
                                        <span className="text-text-secondary text-sm group-hover:text-text-primary transition-colors">{label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick note */}
                        <div className="glass rounded-2xl p-5 border border-violet/15">
                            <p className="text-text-muted text-sm leading-relaxed">
                                💡 I typically respond within{' '}
                                <span className="text-violet-light font-medium">24-48 hours</span>.
                                For urgent matters, LinkedIn DMs work best.
                            </p>
                        </div>
                    </div>

                    {/* ─── Right: Form ─────────────────────────────── */}
                    <div className="lg:col-span-3">
                        <div className="glass rounded-3xl p-8 md:p-10 border border-white/6 relative overflow-hidden">
                            {/* Background glow */}
                            <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan/8 rounded-full blur-3xl pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center py-16 text-center relative z-10"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet/30 to-cyan/20 border border-violet/30 flex items-center justify-center mb-6">
                                            <RiCheckboxCircleLine size={40} className="text-cyan-light" />
                                        </div>
                                        <h2 className="font-display font-bold text-2xl text-text-primary mb-3">
                                            Message Sent! 🎉
                                        </h2>
                                        <p className="text-text-secondary max-w-sm">
                                            Thanks for reaching out. I'll get back to you as soon as possible.
                                        </p>
                                        <button
                                            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                            className="mt-8 btn-secondary px-6 py-2.5 text-sm rounded-xl"
                                        >
                                            Send Another
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-5 relative z-10"
                                    >
                                        <h2 className="font-display font-bold text-xl text-text-primary mb-6">
                                            Send a message
                                        </h2>

                                        {/* Name + Email */}
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-text-secondary text-xs font-medium block mb-1.5">
                                                    Your Name <span className="text-violet-light">*</span>
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={form.name}
                                                    onChange={set('name')}
                                                    placeholder="Archit Chandrakar"
                                                    className="admin-input px-4 py-3 text-sm w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-text-secondary text-xs font-medium block mb-1.5">
                                                    Email Address <span className="text-violet-light">*</span>
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={form.email}
                                                    onChange={set('email')}
                                                    placeholder="you@example.com"
                                                    className="admin-input px-4 py-3 text-sm w-full"
                                                />
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="text-text-secondary text-xs font-medium block mb-1.5">
                                                Subject <span className="text-violet-light">*</span>
                                            </label>
                                            <select
                                                required
                                                value={form.subject}
                                                onChange={set('subject')}
                                                className="admin-input px-4 py-3 text-sm w-full appearance-none"
                                            >
                                                <option value="" disabled>Select a topic…</option>
                                                <option value="collaboration">Collaboration Opportunity</option>
                                                <option value="consulting">Product Consulting</option>
                                                <option value="speaking">Speaking / Podcast</option>
                                                <option value="feedback">Feedback on My Work</option>
                                                <option value="other">Just Saying Hi ✌️</option>
                                            </select>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="text-text-secondary text-xs font-medium block mb-1.5">
                                                Message <span className="text-violet-light">*</span>
                                            </label>
                                            <textarea
                                                required
                                                rows={6}
                                                value={form.message}
                                                onChange={set('message')}
                                                placeholder="Tell me about your project, idea, or anything you'd like to discuss…"
                                                className="admin-input px-4 py-3 text-sm w-full resize-none"
                                            />
                                        </div>

                                        {/* Submit */}
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="btn-primary w-full py-3.5 text-sm rounded-2xl flex items-center justify-center gap-2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending…
                                                </>
                                            ) : (
                                                <>
                                                    <RiSendPlaneLine size={16} />
                                                    Send Message
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
