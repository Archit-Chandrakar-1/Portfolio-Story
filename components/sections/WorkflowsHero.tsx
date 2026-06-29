'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { RiGlobalLine, RiRefreshLine, RiSparkling2Fill } from 'react-icons/ri';
import ScrollReveal from '@/components/ui/ScrollReveal';

function DiagramBox({
    label,
    sub,
    big,
    icon,
}: {
    label: string;
    sub: string;
    big?: boolean;
    icon?: ReactNode;
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-lime/40 bg-surface shadow-card shrink-0 ${
                big ? 'w-40 h-28 sm:w-48 sm:h-32' : 'w-28 h-24 sm:w-32 sm:h-28'
            }`}
        >
            {icon && <div className="mb-1">{icon}</div>}
            <span className="font-display font-bold text-navy text-sm sm:text-base">{label}</span>
            <span className="text-[10px] sm:text-xs text-text-secondary">{sub}</span>
        </div>
    );
}

function Connector({ icon }: { icon: ReactNode }) {
    return (
        <div className="relative flex items-center w-10 sm:w-20 h-8 shrink-0">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-lime/40" />
            <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime shadow-lime"
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-lime/50 bg-bg flex items-center justify-center text-lime">
                {icon}
            </div>
        </div>
    );
}

function VerticalConnector({ icon }: { icon: ReactNode }) {
    return (
        <div className="relative flex items-center justify-center w-8 h-10 shrink-0">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-lime/40" />
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-lime shadow-lime"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-lime/50 bg-bg flex items-center justify-center text-lime">
                {icon}
            </div>
        </div>
    );
}

export default function WorkflowsHero() {
    return (
        <section className="relative pt-32 pb-16 px-6 bg-bg overflow-hidden">
            <div className="max-w-5xl mx-auto text-center">
                {/* Heading */}
                <ScrollReveal>
                    <span className="bg-lime text-navy text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-5 inline-block">
                        Automation & AI Agents
                    </span>
                    <h1 className="font-display font-black text-4xl sm:text-6xl text-white leading-tight mb-4">
                        I Build Systems That{' '}
                        <span className="relative inline-block">
                            Work While You Don&apos;t
                            <span className="absolute -bottom-1 left-0 right-0 h-3 bg-lime/40 -z-10 rounded" />
                        </span>
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed mb-16">
                        Every workflow below started as a manual, repetitive task. I design and ship
                        AI-powered pipelines — using tools like n8n and Zapier — that turn hours of
                        busywork into seconds of automation.
                    </p>
                </ScrollReveal>

                {/* Diagram — vertical stack on small screens, horizontal from sm: up */}
                <ScrollReveal delay={0.15}>
                    <div className="flex sm:hidden flex-col items-center">
                        <DiagramBox label="Input" sub="Trigger" />
                        <VerticalConnector icon={<RiGlobalLine size={16} />} />
                        <DiagramBox
                            label="AI Agent"
                            sub="Think · Decide"
                            big
                            icon={<RiSparkling2Fill size={22} className="text-lime" />}
                        />
                        <VerticalConnector icon={<RiRefreshLine size={16} />} />
                        <DiagramBox label="Output" sub="Action" />
                    </div>
                    <div className="hidden sm:flex items-center justify-center flex-wrap gap-0">
                        <DiagramBox label="Input" sub="Trigger" />
                        <Connector icon={<RiGlobalLine size={16} />} />
                        <DiagramBox
                            label="AI Agent"
                            sub="Think · Decide"
                            big
                            icon={<RiSparkling2Fill size={22} className="text-lime" />}
                        />
                        <Connector icon={<RiRefreshLine size={16} />} />
                        <DiagramBox label="Output" sub="Action" />
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
