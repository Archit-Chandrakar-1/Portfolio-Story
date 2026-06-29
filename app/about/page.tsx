import { getSiteConfig } from '@/lib/firestore';
import ScrollReveal from '@/components/ui/ScrollReveal';
import AboutJetVideo from '@/components/sections/AboutJetVideo';
import ResumeViewerButton from '@/components/ui/ResumeViewerButton';
import { RiMailSendLine, RiLinkedinFill, RiDownload2Line, RiMapPinLine } from 'react-icons/ri';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About — Archit Chandrakar',
    description: 'Learn more about Archit Chandrakar, Product Manager.',
};

export const revalidate = 60;

export default async function AboutPage() {
    const about = await getSiteConfig().catch(() => null);

    const name = about?.name ?? '';
    const headline = about?.headline ?? '';
    const bio = about?.bio ?? '';
    const location = about?.location ?? '';
    const email = about?.email ?? '';

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                {/* Hero row */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    {/* Text */}
                    <ScrollReveal direction="left">
                        <div>
                            <span className="glass border border-violet/30 text-violet-light text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-6 inline-block">About Me</span>
                            <h1 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight mb-4">
                                Hey, I'm{' '}
                                <span className="gradient-text">{name.split(' ')[0]}</span>
                            </h1>
                            <p className="text-white/70 text-lg leading-relaxed mb-6">{headline}</p>
                            <div className="flex items-center gap-2 text-white/50 text-sm mb-8">
                                <RiMapPinLine size={14} className="text-cyan-light" />
                                <span>{location}</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <a href={`mailto:${email}`} className="btn-primary px-6 py-2.5 text-sm rounded-xl flex items-center gap-2">
                                    <RiMailSendLine size={15} />
                                    Get in Touch
                                </a>
                                {about?.resumeUrl && (
                                    <>
                                        <a href={about.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary px-6 py-2.5 text-sm rounded-xl flex items-center gap-2">
                                            <RiDownload2Line size={15} />
                                            Download CV
                                        </a>
                                        <ResumeViewerButton url={about.resumeUrl} />
                                    </>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Photo */}
                    <ScrollReveal direction="right" delay={0.2}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-radial from-violet/20 to-transparent rounded-3xl blur-2xl" />
                            <div className="gradient-border overflow-hidden rounded-3xl aspect-square max-w-sm mx-auto relative">
                                <Image
                                    src={about?.photoUrl || '/images/archit.jpg'}
                                    alt={name}
                                    fill
                                    className="object-cover object-top"
                                    priority
                                />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Bio */}
                <ScrollReveal>
                    <div className="glass rounded-3xl p-8 md:p-12 border border-white/6 mb-12">
                        <h2 className="font-display font-bold text-2xl text-text-primary mb-6">My Story</h2>
                        <div className="space-y-4">
                            {bio.split('\n\n').map((para, i) => (
                                <p key={i} className="text-text-secondary leading-relaxed text-base">{para}</p>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Skills / Values */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                        { title: 'Product Strategy', desc: 'North star metrics, OKR frameworks, roadmap prioritization' },
                        { title: 'User Research', desc: 'Jobs-to-be-done, contextual inquiry, usability testing' },
                        { title: 'Data & Analytics', desc: 'SQL, Mixpanel, A/B experiments, funnel analysis' },
                        { title: 'Cross-functional Leadership', desc: 'Aligning engineering, design, marketing, and sales' },
                        { title: 'Go-to-Market', desc: 'Launch planning, pricing strategy, partner programs' },
                        { title: 'Agile / Scrum', desc: 'Sprint planning, backlog grooming, stakeholder reviews' },
                    ].map(({ title, desc }, i) => (
                        <ScrollReveal key={title} delay={i * 0.08} direction="up">
                            <div className="glass rounded-2xl p-6 border border-white/6 card-hover h-full">
                                <div className="w-8 h-1 rounded-full bg-gradient-to-r from-violet to-cyan mb-4" />
                                <h3 className="font-display font-semibold text-text-primary mb-2">{title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Jet video banner */}
                <ScrollReveal className="mt-12">
                    <AboutJetVideo />
                </ScrollReveal>
            </div>
        </div>
    );
}
