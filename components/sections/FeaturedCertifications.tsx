import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { RiArrowRightLine, RiAwardLine, RiExternalLinkLine } from 'react-icons/ri';
import Image from 'next/image';
import type { Certification } from '@/lib/firestore';

export default function FeaturedCertifications({ certs }: { certs: Certification[] }) {
    const display = certs.slice(0, 4);

    return (
        <section className="py-24 px-6 relative bg-bg">
            {/* Subtle divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-lime/60 to-transparent" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
                    <div>
                        <span className="bg-mint/50 border border-mint text-navy text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-4 inline-block">
                            Credentials
                        </span>
                        <h2 className="font-display font-black text-4xl sm:text-5xl text-navy mt-3">
                            Certifications &{' '}
                            <span className="relative inline-block">
                                Learning
                                <span className="absolute -bottom-1 left-0 right-0 h-2.5 bg-lime/40 -z-10 rounded" />
                            </span>
                        </h2>
                        <p className="text-text-secondary mt-3 max-w-md">
                            Continuous learning is the PM superpower. Here's my commitment to staying sharp.
                        </p>
                    </div>
                    <Link
                        href="/certifications"
                        className="btn-secondary px-5 py-2.5 text-sm rounded-xl flex items-center gap-2 self-start sm:self-auto shrink-0"
                    >
                        View All <RiArrowRightLine size={16} />
                    </Link>
                </ScrollReveal>

                {/* Stats strip */}
                <ScrollReveal delay={0.05}>
                    <div className="bg-white rounded-2xl p-5 border border-border mb-10 flex flex-wrap divide-x divide-border shadow-card">
                        {[
                            { label: 'Certifications', value: certs.length || display.length },
                            { label: 'Institutions', value: new Set(display.map(c => c.issuer)).size },
                            { label: 'Latest Year', value: Math.max(...display.map(c => parseInt(c.date) || 0)) || '2023' },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex-1 text-center px-4 py-2">
                                <div className="font-display font-black text-2xl text-navy">{value}</div>
                                <div className="text-text-muted text-xs mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {display.map((cert, i) => (
                        <ScrollReveal key={cert.id} delay={i * 0.08} direction="up">
                            <div className="bg-white rounded-2xl p-5 border border-border card-hover h-full flex flex-col shadow-card">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-11 h-11 rounded-2xl bg-lime/20 border border-lime/30 flex items-center justify-center">
                                        {cert.badgeUrl ? (
                                            <Image src={cert.badgeUrl} alt={cert.name} width={28} height={28} className="object-contain" />
                                        ) : (
                                            <RiAwardLine size={20} className="text-navy" />
                                        )}
                                    </div>
                                    <span className="text-text-muted text-xs bg-border px-2 py-0.5 rounded-lg border border-border">
                                        {cert.date}
                                    </span>
                                </div>
                                <h3 className="font-display font-bold text-sm text-navy mb-1 leading-snug">
                                    {cert.name}
                                </h3>
                                <p className="text-lime-dark text-xs font-semibold mb-3">{cert.issuer}</p>
                                <p className="text-text-muted text-xs leading-relaxed flex-1 line-clamp-3">
                                    {cert.description}
                                </p>
                                {cert.credentialUrl && cert.credentialUrl !== '#' && (
                                    <a
                                        href={cert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 flex items-center gap-1 text-xs text-navy hover:text-lime-dark font-medium transition-colors"
                                    >
                                        View <RiExternalLinkLine size={10} />
                                    </a>
                                )}
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
