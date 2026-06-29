import { getDocument, Workflow } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { RiArrowLeftLine, RiExternalLinkLine } from 'react-icons/ri';
import ScrollReveal from '@/components/ui/ScrollReveal';
import WorkflowTimeline from '@/components/sections/WorkflowTimeline';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }) {
    const workflow = await getDocument<Workflow>(`workflows/${params.id}`);
    if (!workflow) return { title: 'Workflow Not Found' };
    return {
        title: `${workflow.title} — Archit Chandrakar`,
        description: workflow.description,
    };
}

export default async function WorkflowPage({ params }: { params: { id: string } }) {
    const workflow = await getDocument<Workflow>(`workflows/${params.id}`);

    if (!workflow) {
        notFound();
    }

    if (workflow.caseStudy?.why?.heading) {
        const { default: WorkflowCaseStudyPage } = await import('@/components/sections/WorkflowCaseStudyPage');
        return <WorkflowCaseStudyPage workflow={workflow} />;
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <ScrollReveal>
                    <Link href="/workflows" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 text-sm font-medium">
                        <RiArrowLeftLine size={16} /> Back to Workflows
                    </Link>

                    <div className="bg-white rounded-3xl border border-border shadow-card p-8 sm:p-10">
                        <h1 className="font-display font-black text-3xl sm:text-5xl text-navy mb-3">{workflow.title}</h1>
                        <p className="text-text-secondary text-lg sm:text-xl mb-6">{workflow.description}</p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {workflow.tags?.map((t) => (
                                <span key={t} className="text-sm px-3 py-1 rounded-lg bg-lime/10 text-navy border border-lime/20">{t}</span>
                            ))}
                        </div>

                        {workflow.nodes?.length > 0 && (
                            <div className="bg-mint/15 rounded-2xl p-5 border border-border mb-8 overflow-x-auto">
                                <div className="min-w-max">
                                    <WorkflowTimeline nodes={workflow.nodes} size="large" />
                                </div>
                            </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">Problem</p>
                                <p className="text-text-secondary leading-relaxed">{workflow.problem}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">Outcome</p>
                                <p className="text-navy font-medium leading-relaxed">{workflow.outcome}</p>
                            </div>
                        </div>

                        {workflow.liveLink && (
                            <a href={workflow.liveLink} target="_blank" rel="noopener noreferrer"
                                className="btn-primary px-6 py-3 text-sm rounded-xl flex items-center gap-2 w-fit">
                                <RiExternalLinkLine size={16} /> View Live
                            </a>
                        )}
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
