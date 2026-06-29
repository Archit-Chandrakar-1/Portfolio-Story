import { getCertifications } from '@/lib/firestore';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { RiAwardLine, RiExternalLinkLine } from 'react-icons/ri';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Certifications — Archit Chandrakar',
    description: 'Professional certifications and credentials of Archit Chandrakar.',
};

export const revalidate = 60;

export default async function CertificationsPage() {
    const data = await getCertifications().catch(() => []);

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <ScrollReveal className="text-center mb-16">
                    <span className="glass border border-cyan/30 text-cyan-light text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-4 inline-block">Credentials</span>
                    <h1 className="font-display font-black text-4xl sm:text-5xl text-white mt-4">
                        Certifications & <span className="gradient-text">Credentials</span>
                    </h1>
                    <p className="text-white/70 mt-4 max-w-xl mx-auto">
                        Continuous learning is the PM superpower. Here's my commitment to staying sharp.
                    </p>
                </ScrollReveal>

                {/* Stats bar */}
                <ScrollReveal delay={0.1}>
                    <div className="glass rounded-2xl p-6 border border-white/6 mb-12 flex flex-wrap divide-x divide-white/8">
                        {[
                            { label: 'Total Certifications', value: data.length },
                            { label: 'Institutions', value: new Set(data.map(c => c.issuer)).size },
                            { label: 'Latest Year', value: data.length > 0 ? (Math.max(...data.map(c => parseInt(c.date) || 0)) || '—') : '—' },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex-1 text-center px-4 py-2">
                                <div className="font-display font-black text-3xl gradient-text">{value}</div>
                                <div className="text-text-muted text-xs mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data.map((cert, i) => (
                        <ScrollReveal key={cert.id} delay={i * 0.07} direction="up">
                            <div className="glass rounded-2xl p-6 border border-white/6 card-hover h-full flex flex-col">
                                {/* Badge or icon */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/10 border border-white/8 flex items-center justify-center">
                                        {cert.badgeUrl ? (
                                            <Image src={cert.badgeUrl} alt={cert.name} width={32} height={32} className="object-contain" />
                                        ) : (
                                            <RiAwardLine size={22} className="text-cyan-light" />
                                        )}
                                    </div>
                                    <span className="text-text-muted text-xs glass px-2.5 py-1 rounded-lg border border-white/8">{cert.date}</span>
                                </div>

                                <h3 className="font-display font-bold text-base text-text-primary mb-1 leading-snug">{cert.name}</h3>
                                <p className="text-violet-light text-xs font-semibold mb-3">{cert.issuer}</p>
                                <p className="text-text-muted text-sm leading-relaxed flex-1">{cert.description}</p>

                                {cert.credentialUrl && cert.credentialUrl !== '#' && (
                                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                                        className="mt-4 flex items-center gap-1.5 text-xs text-cyan-light hover:text-white font-medium transition-colors">
                                        View Credential <RiExternalLinkLine size={11} />
                                    </a>
                                )}
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Empty State */}
                {data.length === 0 && (
                    <div className="glass rounded-2xl p-12 text-center border border-white/6 mt-12">
                        <p className="text-text-muted">No credentials have been added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
