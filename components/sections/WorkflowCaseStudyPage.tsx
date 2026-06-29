import Link from 'next/link';
import {
    RiArrowLeftLine,
    RiArrowRightLine,
    RiExternalLinkLine,
    RiGithubLine,
    RiNotionLine,
} from 'react-icons/ri';
import type { Workflow } from '@/lib/firestore';
import WorkflowTimeline from './WorkflowTimeline';

interface Props {
    workflow: Workflow;
}

function Section({
    number,
    label,
    heading,
    body,
}: {
    number: string;
    label: string;
    heading: string;
    body: string;
}) {
    return (
        <div className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
                <span className="font-display font-black text-5xl text-navy/8 select-none leading-none">
                    {number}
                </span>
                <div>
                    <span className="bg-lime text-navy text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                        {label}
                    </span>
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                        {heading}
                    </h2>
                </div>
            </div>
            <div className="space-y-4">
                {body.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-text-secondary leading-relaxed text-base">
                        {para}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default function WorkflowCaseStudyPage({ workflow }: Props) {
    const cs = workflow.caseStudy;
    if (!cs || !cs.why || !cs.how || !cs.results) {
        return <div>Case study data incomplete.</div>;
    }

    return (
        <main className="min-h-screen bg-bg">
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <div className="relative bg-navy overflow-hidden">
                <div className="relative max-w-4xl mx-auto px-6 pt-32 pb-16">
                    <Link
                        href="/workflows"
                        className="inline-flex items-center gap-2 text-lime/70 hover:text-lime text-sm font-medium mb-10 transition-colors"
                    >
                        <RiArrowLeftLine size={15} /> Back to Workflows
                    </Link>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        {workflow.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/10 text-lime/80 border border-white/10"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="font-display font-black text-4xl sm:text-6xl text-white mb-4 leading-tight">
                        {workflow.title}
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl leading-relaxed mb-6">
                        {workflow.description}
                    </p>

                    {/* Tool + impact */}
                    <div className="flex flex-wrap items-center gap-3 mb-10">
                        <span className="text-[11px] font-mono font-semibold px-3 py-1.5 rounded-full bg-white/10 text-lime border border-white/10">
                            {workflow.tool}
                        </span>
                        <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-lime text-navy">
                            {workflow.impact}
                        </span>
                    </div>

                    {/* CTA links */}
                    <div className="flex flex-wrap items-center gap-3">
                        {workflow.liveLink && (
                            <a
                                href={workflow.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-lime text-navy text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-lime/90 transition-colors"
                            >
                                View Live <RiExternalLinkLine size={14} />
                            </a>
                        )}
                        {workflow.githubLink && (
                            <a
                                href={workflow.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/15 transition-colors border border-white/10"
                            >
                                GitHub <RiGithubLine size={14} />
                            </a>
                        )}
                        {workflow.notionLink && (
                            <a
                                href={workflow.notionLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/15 transition-colors border border-white/10"
                            >
                                Notion <RiNotionLine size={14} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Pipeline diagram ─────────────────────────────────────────── */}
            {workflow.nodes?.length > 0 && (
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-6 text-center">
                        The Pipeline
                    </p>
                    <div className="bg-white rounded-3xl border border-border shadow-card p-8 overflow-x-auto">
                        <div className="flex justify-center min-w-max">
                            <WorkflowTimeline nodes={workflow.nodes} size="large" />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Sections ─────────────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
                <Section number="01" label="Why" heading={cs.why.heading} body={cs.why.body} />
                <Section number="02" label="How" heading={cs.how.heading} body={cs.how.body} />
                <Section number="03" label="Results" heading={cs.results.heading} body={cs.results.body} />

                {/* ── Footer CTA ────────────────────────────────────────────── */}
                <div className="border-t border-border pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <p className="font-display font-black text-2xl text-white">
                            Want something like this built?
                        </p>
                        <p className="text-text-secondary text-sm mt-1">
                            I design and ship custom AI agents and automations end-to-end.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/workflows"
                            className="btn-secondary px-5 py-2.5 text-sm rounded-xl flex items-center gap-2"
                        >
                            <RiArrowLeftLine size={14} /> All Workflows
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-lime text-navy text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-lime/90 transition-colors flex items-center gap-2"
                        >
                            Let's Chat <RiArrowRightLine size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
