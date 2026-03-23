import { getSiteConfig } from '@/lib/firestore';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { RiMapPinLine, RiMailSendLine, RiDownload2Line } from 'react-icons/ri';
import Image from 'next/image';

export default async function LandingAbout() {
    const about = await getSiteConfig().catch(() => null);

    const name = about?.name || 'Archit Chandrakar';
    const headline = about?.headline || 'Product Manager | Builder | Storyteller';
    const bio = about?.bio || `I'm a Product Manager with 5+ years of experience building digital products that people actually love. My work sits at the intersection of user empathy, business strategy, and engineering reality.\n\nI've led products from zero to millions of users, managed cross-functional teams of 15+, and shipped across B2B SaaS, consumer apps, and marketplace platforms.`;
    const location = about?.location || 'India';
    const email = about?.email || 'archit@example.com';

    const skills = [
        { title: 'Product Strategy', desc: 'North star metrics, OKR frameworks, roadmap prioritization' },
        { title: 'User Research', desc: 'Jobs-to-be-done, contextual inquiry, usability testing' },
        { title: 'Data & Analytics', desc: 'SQL, Mixpanel, A/B experiments, funnel analysis' },
        { title: 'Cross-functional Leadership', desc: 'Aligning engineering, design, marketing, and sales' },
        { title: 'Go-to-Market', desc: 'Launch planning, pricing strategy, partner programs' },
        { title: 'Agile / Scrum', desc: 'Sprint planning, backlog grooming, stakeholder reviews' },
    ];

    return (
        <section className="py-20 px-6 bg-bg">
            <div className="max-w-6xl mx-auto">
                {/* Grid: photo + intro */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    {/* Text side */}
                    <ScrollReveal direction="left">
                        <span className="bg-lime/30 border border-lime/60 text-navy text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-5 inline-block">
                            About Me
                        </span>
                        <h2 className="font-display font-black text-4xl sm:text-5xl text-navy leading-tight mb-4">
                            Hey, I'm{' '}
                            <span className="relative inline-block">
                                {name.split(' ')[0]}
                                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-lime/40 -z-10 rounded" />
                            </span>
                        </h2>
                        <p className="text-text-secondary text-lg leading-relaxed mb-3">{headline}</p>
                        <div className="flex items-center gap-2 text-text-muted text-sm mb-6">
                            <RiMapPinLine size={14} className="text-lime-dark" />
                            <span>{location}</span>
                        </div>

                        {/* Short bio — first paragraph only */}
                        <p className="text-text-secondary leading-relaxed mb-8">
                            {bio.split('\n\n')[0]}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <a
                                href={`mailto:${email}`}
                                className="btn-primary px-6 py-2.5 text-sm rounded-xl flex items-center gap-2"
                            >
                                <RiMailSendLine size={15} />
                                Get in Touch
                            </a>
                            {about?.resumeUrl && (
                                <a
                                    href={about.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary px-6 py-2.5 text-sm rounded-xl flex items-center gap-2"
                                >
                                    <RiDownload2Line size={15} />
                                    Download CV
                                </a>
                            )}
                        </div>
                    </ScrollReveal>

                    {/* Photo side */}
                    <ScrollReveal direction="right" delay={0.2}>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-lime/15 rounded-3xl blur-2xl" />
                            <div className="relative overflow-hidden rounded-3xl aspect-square max-w-sm mx-auto border-4 border-white shadow-card-hover">
                                <Image
                                    src={about?.photoUrl || '/images/archit.jpg'}
                                    alt={name}
                                    fill
                                    className="object-cover object-top"
                                    priority
                                />
                            </div>
                            {/* Floating badge */}

                        </div>
                    </ScrollReveal>
                </div>

                {/* Skills grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {skills.map(({ title, desc }, i) => (
                        <ScrollReveal key={title} delay={i * 0.08} direction="up">
                            <div className="bg-white rounded-2xl p-6 border border-border card-hover h-full shadow-card">
                                <div className="w-8 h-1.5 rounded-full bg-lime mb-4" />
                                <h3 className="font-display font-semibold text-navy mb-2">{title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
