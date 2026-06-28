import Image from 'next/image';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { RiExternalLinkLine } from 'react-icons/ri';
import type { Client } from '@/lib/firestore';

function ClientCard({ client, index }: { client: Client; index: number }) {
    return (
        <ScrollReveal delay={index * 0.08} direction="up">
            <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-surface rounded-3xl overflow-hidden border border-border card-hover h-full flex flex-col shadow-card"
            >
                {/* Logo area */}
                <div className="h-36 relative bg-mint/20 flex items-center justify-center overflow-hidden border-b border-border">
                    {client.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={client.logoUrl}
                            alt={`${client.name} logo`}
                            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <span className="font-display font-black text-5xl text-navy/20 group-hover:text-navy/30 transition-colors">
                            {client.name ? client.name[0].toUpperCase() : '✧'}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    {/* Name + link icon */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display font-bold text-lg text-navy leading-snug">
                            {client.name}
                        </h3>
                        <RiExternalLinkLine
                            size={15}
                            className="text-text-secondary group-hover:text-navy shrink-0 mt-1 transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">
                        {client.description}
                    </p>

                    {/* Tags */}
                    {client.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                            {client.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs px-2.5 py-0.5 rounded-lg bg-lime/20 text-navy border border-lime/40 font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </a>
        </ScrollReveal>
    );
}

export default function ClientsSection({ clients }: { clients: Client[] }) {
    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <ScrollReveal className="mb-14">
                <span className="bg-lime text-navy text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-4 inline-block">
                    Freelance Work
                </span>
                <h1 className="font-display font-black text-4xl sm:text-5xl text-white mt-3">
                    Clients I&apos;ve{' '}
                    <span className="relative inline-block">
                        Worked With
                        <span className="absolute -bottom-1 left-0 right-0 h-2.5 bg-lime/40 -z-10 rounded" />
                    </span>
                </h1>
                <p className="text-white/70 mt-3 max-w-xl text-base leading-relaxed">
                    A selection of businesses and founders I&apos;ve partnered with — from early-stage
                    startups to growing products.
                </p>
            </ScrollReveal>

            {/* Grid */}
            {clients.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client, i) => (
                        <ClientCard key={client.id ?? i} client={client} index={i} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 text-text-secondary text-sm">
                    No clients to show yet.
                </div>
            )}
        </div>
    );
}