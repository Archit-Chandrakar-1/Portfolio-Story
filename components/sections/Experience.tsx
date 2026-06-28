'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RiBriefcaseLine } from 'react-icons/ri';
import { ExperienceEntry } from '@/lib/firestore';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface ExperienceProps {
    experiences: ExperienceEntry[];
}

export default function Experience({ experiences }: ExperienceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    const data = experiences.length
        ? experiences
        : [
            { id: '1', title: 'Senior Product Manager', company: 'Tech Corp', startDate: '2022', endDate: 'Present', current: true, description: 'Led cross-functional teams to ship 3 major product lines, growing DAU by 40%. Defined product vision and roadmap across mobile and web platforms.', tags: ['Product Strategy', 'Roadmapping', 'Agile', 'B2B SaaS'], order: 1 },
            { id: '2', title: 'Product Manager', company: 'StartupXYZ', startDate: '2020', endDate: '2022', current: false, description: 'Built and launched the core product from 0 to 100k users. Established the PM function, hired a team, and created data-driven processes.', tags: ['0→1', 'User Research', 'Data Analytics', 'Mobile'], order: 2 },
            { id: '3', title: 'Associate Product Manager', company: 'BigCo Inc', startDate: '2018', endDate: '2020', current: false, description: 'Managed 2 product verticals, drove feature discovery through user interviews, and shipped quarterly product improvements.', tags: ['Feature Delivery', 'User Interviews', 'A/B Testing'], order: 3 },
        ];

    return (
        <section className="py-24 relative overflow-hidden bg-bg">
            {/* Background decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-mint/30 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <span className="bg-mint/50 border border-mint text-navy text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-4 inline-block">
                            My Journey
                        </span>
                        <h2 className="font-display font-black text-4xl sm:text-5xl text-white mt-4">
                            Experience <span className="relative inline-block">
                                Timeline
                                <span className="absolute -bottom-1 left-0 right-0 h-2 bg-lime/40 -z-10 rounded" />
                            </span>
                        </h2>
                        <p className="text-white/70 mt-4 max-w-xl mx-auto">
                            A story of growth, impact, and relentless product thinking.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Timeline */}
                <div ref={containerRef} className="relative max-w-3xl mx-auto">
                    {/* Animated vertical line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2">
                        <motion.div
                            style={{ height: lineHeight }}
                            className="w-full timeline-line rounded-full origin-top"
                        />
                    </div>

                    <div className="space-y-12">
                        {data.map((exp, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <ScrollReveal key={exp.id || i} delay={i * 0.1} direction={isLeft ? 'left' : 'right'}>
                                    <div className={`relative flex flex-col md:flex-row ${isLeft ? 'md:flex-row-reverse' : ''} items-start gap-6 md:gap-10`}>
                                        {/* Dot */}
                                        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 + 0.3, type: 'spring' }}
                                                className="w-4 h-4 rounded-full bg-lime border-2 border-navy shadow-lime"
                                            />
                                        </div>

                                        {/* Card */}
                                        <div className={`ml-12 md:ml-0 md:w-[46%] ${isLeft ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4'}`}>
                                            <div className="bg-white rounded-2xl p-6 border border-border card-hover cursor-default shadow-card">
                                                {/* Header */}
                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                    <div>
                                                        <h3 className="font-display font-bold text-lg text-navy">{exp.title}</h3>
                                                        <div className="flex items-center gap-1.5 text-text-secondary text-sm mt-1">
                                                            <RiBriefcaseLine size={13} />
                                                            <span>{exp.company}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${exp.current ? 'bg-lime/30 text-navy border border-lime/50' : 'bg-border text-text-muted border border-border'}`}>
                                                            {exp.current ? '● Present' : exp.endDate}
                                                        </span>
                                                        <p className="text-text-muted text-xs mt-1">{exp.startDate}</p>
                                                    </div>
                                                </div>

                                                <p className="text-text-secondary text-sm leading-relaxed mb-4">{exp.description}</p>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2">
                                                    {(exp.tags || []).map((tag) => (
                                                        <span key={tag} className="text-xs px-2.5 py-0.5 rounded-lg bg-mint/30 text-navy border border-mint/50">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
