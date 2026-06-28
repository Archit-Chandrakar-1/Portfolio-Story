'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
    RiArrowRightLine,
    RiExternalLinkLine,
    RiGithubLine,
    RiNotionLine,
    RiArrowDownSLine,
    RiFlowChart,
    RiFileTextLine,
} from 'react-icons/ri';
import type { Workflow, WorkflowTag } from '@/lib/firestore';
import WorkflowTimeline from './WorkflowTimeline';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_TAGS: WorkflowTag[] = ['AI', 'Automation', 'Analytics', 'Research', 'GTM'];

const TAG_STYLES: Record<WorkflowTag, string> = {
    AI: 'bg-violet-100 text-violet-700 border-violet-200',
    Automation: 'bg-lime/20 text-navy border-lime/40',
    Analytics: 'bg-sky-100 text-sky-700 border-sky-200',
    Research: 'bg-amber-100 text-amber-700 border-amber-200',
    GTM: 'bg-rose-100 text-rose-700 border-rose-200',
};


// ─── Workflow Card ─────────────────────────────────────────────────────────────

function WorkflowCard({ workflow, index }: { workflow: Workflow; index: number }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <ScrollReveal delay={index * 0.1} direction="up">
            <article className="bg-white rounded-3xl overflow-hidden border border-border card-hover h-full flex flex-col group shadow-card">

                {/* Screenshot / placeholder */}
                <div className="h-48 relative bg-mint/20 flex items-center justify-center overflow-hidden border-b border-border">
                    {workflow.imageUrl ? (
                        <Image
                            src={workflow.imageUrl}
                            alt={`${workflow.title} workflow`}
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-3 px-4">
                            <RiFlowChart size={22} className="text-navy/30" />
                            <WorkflowTimeline nodes={workflow.nodes} size="compact" />
                        </div>
                    )}

                    {/* Tool badge */}
                    <span className="absolute top-3 right-3 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-navy text-lime shadow-sm">
                        {workflow.tool}
                    </span>

                    {/* Impact pill */}
                    <span className="absolute bottom-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-lime text-navy shadow-sm">
                        {workflow.impact}
                    </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {workflow.tags.map((tag) => (
                            <span
                                key={tag}
                                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-lg border ${TAG_STYLES[tag]}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg text-navy mb-2 leading-snug">
                        {workflow.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        {workflow.description}
                    </p>

                    {/* Expandable detail drawer */}
                    {expanded && (
                        <div className="mb-4 space-y-4 border-t border-border pt-4 animate-in fade-in duration-200">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">
                                    Problem
                                </p>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {workflow.problem}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">
                                    Outcome
                                </p>
                                <p className="text-sm text-navy font-medium leading-relaxed">
                                    {workflow.outcome}
                                </p>
                            </div>
                            {/* Node flow (only shown here when a screenshot already fills the card top) */}
                            {workflow.imageUrl && workflow.nodes?.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">
                                        Pipeline
                                    </p>
                                    <div className="bg-mint/20 rounded-2xl p-3 border border-border">
                                        <WorkflowTimeline nodes={workflow.nodes} size="compact" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer: expand toggle + links */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                        <button
                            onClick={() => setExpanded((e) => !e)}
                            className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-lime-dark transition-colors"
                        >
                            {expanded ? 'Show less' : 'Show details'}
                            <RiArrowDownSLine
                                size={15}
                                className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <div className="flex items-center gap-3">
                            {workflow.caseStudy?.why?.heading && (
                                <Link
                                    href={`/workflows/${workflow.id}`}
                                    className="flex items-center gap-1 text-xs font-bold text-navy hover:text-lime-dark transition-colors"
                                >
                                    Case Study <RiFileTextLine size={11} />
                                </Link>
                            )}
                            {workflow.liveLink && (
                                <a
                                    href={workflow.liveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-lime-dark transition-colors"
                                >
                                    Live <RiExternalLinkLine size={11} />
                                </a>
                            )}
                            {workflow.githubLink && (
                                <a
                                    href={workflow.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-lime-dark transition-colors"
                                >
                                    GitHub <RiGithubLine size={11} />
                                </a>
                            )}
                            {workflow.notionLink && (
                                <a
                                    href={workflow.notionLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-lime-dark transition-colors"
                                >
                                    Notion <RiNotionLine size={11} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </ScrollReveal>
    );
}

// ─── Section ──────────────────────────────────────────────────────────────────
// This is a Client Component — receives `workflows` fetched by the parent
// Server Component. See usage instructions at the bottom of this file.

export default function WorkflowsSection({ workflows }: { workflows: Workflow[] }) {
    const [activeTag, setActiveTag] = useState<WorkflowTag | 'All'>('All');

    const filtered =
        activeTag === 'All'
            ? workflows
            : workflows.filter((w) => w.tags.includes(activeTag));

    if (workflows.length === 0) return null;

    return (
        <section id="workflows" className="py-24 px-6 bg-bg">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
                    <div>
                        <span className="bg-lime text-navy text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-4 inline-block">
                            Automation & AI
                        </span>
                        <h2 className="font-display font-black text-4xl sm:text-5xl text-white mt-3">
                            Workflows I&apos;ve{' '}
                            <span className="relative inline-block">
                                Built
                                <span className="absolute -bottom-1 left-0 right-0 h-2.5 bg-lime/40 -z-10 rounded" />
                            </span>
                        </h2>
                        <p className="text-white/70 mt-3 max-w-md">
                            I don&apos;t just define automation — I build it. Real pipelines that
                            eliminate manual work across research, analytics, and launch ops.
                        </p>
                    </div>
                    <Link
                        href="/contact"
                        className="btn-secondary px-5 py-2.5 text-sm rounded-xl flex items-center gap-2 self-start sm:self-auto shrink-0"
                    >
                        Let&apos;s Chat <RiArrowRightLine size={16} />
                    </Link>
                </ScrollReveal>

                {/* Tag filter pills */}
                <ScrollReveal className="flex flex-wrap gap-2 mb-10">
                    <button
                        onClick={() => setActiveTag('All')}
                        className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors ${activeTag === 'All'
                                ? 'bg-navy text-lime border-navy'
                                : 'bg-white text-navy border-border hover:border-navy/40'
                            }`}
                    >
                        All
                    </button>
                    {ALL_TAGS.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors ${activeTag === tag
                                    ? 'bg-navy text-lime border-navy'
                                    : 'bg-white text-navy border-border hover:border-navy/40'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </ScrollReveal>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((workflow, i) => (
                        <WorkflowCard key={workflow.id ?? i} workflow={workflow} index={i} />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-text-secondary py-16 text-sm">
                        No workflows in this category yet.
                    </p>
                )}
            </div>
        </section>
    );
}