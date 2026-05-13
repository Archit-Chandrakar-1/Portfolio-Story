import Image from 'next/image';
import Link from 'next/link';
import {
    RiArrowLeftLine,
    RiExternalLinkLine,
    RiFilePdfLine,
    RiArrowRightLine,
} from 'react-icons/ri';
import type { Product } from '@/lib/firestore';

// ─── Section step data ────────────────────────────────────────────────────────

const STEPS = [
    { key: 'problem', label: 'Problem', number: '01' },
    { key: 'research', label: 'Research', number: '02' },
    { key: 'solution', label: 'Solution', number: '03' },
    { key: 'metrics', label: 'Metrics', number: '04' },
    { key: 'learnings', label: 'Learnings', number: '05' },
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    product: Product;
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
    label,
    before,
    after,
    index,
}: {
    label: string;
    before: string;
    after: string;
    index: number;
}) {
    return (
        <div className="bg-white rounded-3xl border border-border shadow-card p-6 flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                {label}
            </p>
            <div className="flex items-center gap-3">
                {/* Before */}
                <div className="flex-1 rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-400 mb-1">
                        Before
                    </p>
                    <p className="font-display font-black text-xl text-rose-600">{before}</p>
                </div>

                <RiArrowRightLine size={18} className="text-text-secondary shrink-0" />

                {/* After */}
                <div className="flex-1 rounded-2xl bg-lime/20 border border-lime/40 px-4 py-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-navy/50 mb-1">
                        After
                    </p>
                    <p className="font-display font-black text-xl text-navy">{after}</p>
                </div>
            </div>
        </div>
    );
}

// ─── Section Block ────────────────────────────────────────────────────────────

function SectionBlock({
    number,
    label,
    heading,
    body,
    imageUrl,
}: {
    number: string;
    label: string;
    heading: string;
    body: string;
    imageUrl?: string;
}) {
    return (
        <div id={label.toLowerCase()} className="scroll-mt-24">
            {/* Step label */}
            <div className="flex items-center gap-3 mb-6">
                <span className="font-display font-black text-5xl text-navy/8 select-none leading-none">
                    {number}
                </span>
                <div>
                    <span className="bg-navy text-lime text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                        {label}
                    </span>
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-navy mt-1">
                        {heading}
                    </h2>
                </div>
            </div>

            {/* Body — supports newlines as paragraphs */}
            <div className="space-y-4 mb-6">
                {body.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-text-secondary leading-relaxed text-base">
                        {para}
                    </p>
                ))}
            </div>

            {/* Optional image */}
            {imageUrl && (
                <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden border border-border shadow-card">
                    <Image
                        src={imageUrl}
                        alt={heading}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CaseStudyPage({ product }: Props) {
    const cs = product.caseStudy;
    if (!cs || !cs.problem || !cs.research || !cs.solution || !cs.learnings) {
        return <div>Case study data incomplete.</div>;
    }

    return (
        <main className="min-h-screen bg-bg">

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <div className="relative bg-navy overflow-hidden">
                {/* Background image with overlay */}
                {product.imageUrl && (
                    <div className="absolute inset-0">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover opacity-10"
                        />
                    </div>
                )}

                <div className="relative max-w-4xl mx-auto px-6 pt-10 pb-16">
                    {/* Back link */}
                    <Link
                        href="/#products"
                        className="inline-flex items-center gap-2 text-lime/70 hover:text-lime text-sm font-medium mb-10 transition-colors"
                    >
                        <RiArrowLeftLine size={15} /> Back to Products
                    </Link>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        {product.tags.map((tag) => (
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
                        {product.name}
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl leading-relaxed mb-8">
                        {product.description}
                    </p>

                    {/* CTA links */}
                    <div className="flex flex-wrap items-center gap-3">
                        {product.link && product.link !== '#' && (
                            <a
                                href={product.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-lime text-navy text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-lime/90 transition-colors"
                            >
                                View Live <RiExternalLinkLine size={14} />
                            </a>
                        )}
                        {product.prdUrl && (
                            <a
                                href={product.prdUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/15 transition-colors border border-white/10"
                            >
                                Read PRD <RiFilePdfLine size={14} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Sticky progress nav ──────────────────────────────────────── */}
            <div className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border">
                <div className="max-w-4xl mx-auto px-6">
                    <nav className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
                        {STEPS.map((step, i) => (
                            <a
                                key={step.key}
                                href={`#${step.label.toLowerCase()}`}
                                className="flex items-center gap-2 shrink-0 text-xs font-semibold text-text-secondary hover:text-navy transition-colors px-3 py-1.5 rounded-lg hover:bg-mint/30"
                            >
                                <span className="w-5 h-5 rounded-full bg-navy/8 text-navy text-[10px] font-bold flex items-center justify-center">
                                    {i + 1}
                                </span>
                                {step.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* ── Content ──────────────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

                {/* 01 Problem */}
                <SectionBlock
                    number="01"
                    label="Problem"
                    heading={cs.problem.heading}
                    body={cs.problem.body}
                    imageUrl={cs.problem.imageUrl}
                />

                {/* Divider */}
                <div className="border-t border-border" />

                {/* 02 Research */}
                <SectionBlock
                    number="02"
                    label="Research"
                    heading={cs.research.heading}
                    body={cs.research.body}
                    imageUrl={cs.research.imageUrl}
                />

                <div className="border-t border-border" />

                {/* 03 Solution */}
                <SectionBlock
                    number="03"
                    label="Solution"
                    heading={cs.solution.heading}
                    body={cs.solution.body}
                    imageUrl={cs.solution.imageUrl}
                />

                <div className="border-t border-border" />

                {/* 04 Metrics */}
                <div id="metrics" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="font-display font-black text-5xl text-navy/8 select-none leading-none">
                            04
                        </span>
                        <div>
                            <span className="bg-navy text-lime text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                                Metrics
                            </span>
                            <h2 className="font-display font-black text-2xl sm:text-3xl text-navy mt-1">
                                The Impact
                            </h2>
                        </div>
                    </div>

                    {cs.metrics.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {cs.metrics.map((m, i) => (
                                <MetricCard
                                    key={i}
                                    index={i}
                                    label={m.label}
                                    before={m.before}
                                    after={m.after}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-text-secondary text-sm">Metrics coming soon.</p>
                    )}
                </div>

                <div className="border-t border-border" />

                {/* 05 Learnings */}
                <SectionBlock
                    number="05"
                    label="Learnings"
                    heading={cs.learnings.heading}
                    body={cs.learnings.body}
                    imageUrl={cs.learnings.imageUrl}
                />

                {/* ── Footer CTA ────────────────────────────────────────────── */}
                <div className="border-t border-border pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <p className="font-display font-black text-2xl text-navy">
                            Want to work together?
                        </p>
                        <p className="text-text-secondary text-sm mt-1">
                            I'm always open to interesting PM roles and collaborations.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/#products"
                            className="btn-secondary px-5 py-2.5 text-sm rounded-xl flex items-center gap-2"
                        >
                            <RiArrowLeftLine size={14} /> All Products
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-navy text-lime text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-colors flex items-center gap-2"
                        >
                            Let's Chat <RiArrowRightLine size={14} />
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}