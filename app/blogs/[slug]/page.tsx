import { getCollectionDocs } from '@/lib/firestore';
import { BlogPost } from '@/lib/firestore';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { RiCalendarLine, RiTimeLine, RiArrowLeftLine } from 'react-icons/ri';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return {
        title: `${params.slug.replace(/-/g, ' ')} — Archit Chandrakar`,
        description: 'Blog post by Archit Chandrakar',
    };
}

function readingTime(content: string) {
    return Math.ceil(content.split(' ').length / 200);
}

export const revalidate = 60;

const DEMO_POSTS: BlogPost[] = [
    {
        id: '1',
        title: "The Product Manager's Superpower: Asking Better Questions",
        slug: 'pm-superpower-better-questions',
        excerpt: "Why the quality of your questions determines the quality of your products.",
        content: `## The Right Question Changes Everything

Most PMs spend 80% of their time answering questions. The best PMs spend 80% of their time asking them.

When I joined my first product role, I thought my job was to have answers. I prepared decks, researched competitors, and walked into every meeting ready to defend a position. I was wrong.

## The Problem with Premature Answers

Premature answers are the #1 killer of product quality. When we jump to solutions before deeply understanding problems, we build features that no one needs. We optimize metrics that don't matter. We confuse business KPIs with user outcomes.

The antidote is better questions.

## A Framework for Question Quality

**Level 1 — Surface Questions**: "What do users want?" Most teams stop here.

**Level 2 — Behavioral Questions**: "What do users actually do vs. say they do?" Better. You're looking at evidence now.

**Level 3 — Emotional Questions**: "How do users feel during this interaction?" Now you're finding the real pain.

**Level 4 — System Questions**: "Why does this pain exist, and what does it tell us about the broader system?" Gold. This is where insights live.

## Practical Exercises

1. **The 5 Whys** — Don't stop at the first explanation. Ask why 5 times.
2. **Silent Interview** — After a user response, wait 5 full seconds before speaking. Users fill silence with depth.
3. **The Assumption Audit** — List every assumption in your PRD, then ask which ones could kill the product if wrong.

The product manager who asks the best questions ships the best products.`,
        coverImage: '',
        tags: ['Product Strategy', 'User Research'],
        published: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
    },
    {
        id: '2',
        title: 'From Feature Factory to Outcome-Driven: A Mindset Shift',
        slug: 'feature-factory-to-outcome-driven',
        excerpt: "Most product teams are trapped shipping features.",
        content: `## Are You Running a Feature Factory?

Signs your team is a feature factory:
- The roadmap is a list of features, not outcomes
- Success is defined by shipping, not by results
- Engineering asks "what are we building?" not "why?"
- Users don't use half of what you ship

## The Outcome-Driven Alternative

Outcome-driven teams set a clear north star: a measurable change in user behavior that drives business results. Then they work backwards.

**Instead of**: "Ship a referral program in Q2"
**Try**: "Increase word-of-mouth acquisition by 25% in Q2"

The difference? The first tells you what to ship. The second tells you what to achieve — and gives your team latitude to find the best way to get there.

## Making the Shift

1. Translate every roadmap item into an outcome statement
2. Define success metrics BEFORE you start building
3. Run discovery sprints to validate assumptions
4. Kill features that don't move your metrics

The best product teams I've worked with don't celebrate shipping. They celebrate learning.`,
        coverImage: '',
        tags: ['Roadmapping', 'OKRs'],
        published: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
];

export default async function BlogPostPage({ params }: Props) {
    let post: BlogPost | undefined;

    try {
        const posts = await getCollectionDocs<BlogPost>('blogs');
        post = posts.find((p) => p.slug === params.slug && p.published);
    } catch {
        post = DEMO_POSTS.find((p) => p.slug === params.slug);
    }

    if (!post) {
        const demo = DEMO_POSTS.find((p) => p.slug === params.slug);
        if (!demo) notFound();
        post = demo;
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-3xl mx-auto px-6">
                {/* Back */}
                <ScrollReveal>
                    <Link href="/blogs" className="inline-flex items-center gap-2 text-text-secondary hover:text-violet-light transition-colors text-sm mb-8">
                        <RiArrowLeftLine size={14} />
                        Back to Blogs
                    </Link>
                </ScrollReveal>

                {/* Header */}
                <ScrollReveal delay={0.1}>
                    <div className="mb-6 flex flex-wrap gap-2">
                        {post.tags.map((t) => (
                            <span key={t} className="text-xs px-2.5 py-0.5 rounded-lg bg-violet/10 text-violet-light border border-violet/15">{t}</span>
                        ))}
                    </div>
                    <h1 className="font-display font-black text-3xl sm:text-4xl text-text-primary leading-tight mb-4">{post.title}</h1>
                    <p className="text-text-secondary text-lg leading-relaxed mb-6">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-text-muted text-sm pb-8 border-b border-white/8">
                        <span className="flex items-center gap-1.5"><RiCalendarLine size={13} className="text-cyan-light" />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1.5"><RiTimeLine size={13} className="text-cyan-light" />{readingTime(post.content)} min read</span>
                    </div>
                </ScrollReveal>

                {/* Content */}
                <ScrollReveal delay={0.2}>
                    <div
                        className="prose prose-invert prose-violet max-w-none mt-8
              prose-headings:font-display prose-headings:text-text-primary
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-text-primary prose-strong:font-semibold
              prose-li:text-text-secondary prose-li:leading-relaxed
              prose-ul:my-4 prose-ol:my-4
              prose-blockquote:border-violet prose-blockquote:text-text-secondary prose-blockquote:not-italic
              prose-code:text-cyan-light prose-code:bg-white/5 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5"
                        dangerouslySetInnerHTML={{
                            __html: post.content
                                .replace(/\n\n/g, '</p><p>')
                                .replace(/^## (.+)$/gm, '</p><h2>$1</h2><p>')
                                .replace(/^### (.+)$/gm, '</p><h3>$1</h3><p>')
                                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                .replace(/^- (.+)$/gm, '<li>$1</li>')
                                .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
                                .replace(/^1\. (.+)$/gm, '<li>$1</li>')
                                .replace(/`(.+?)`/g, '<code>$1</code>'),
                        }}
                    />
                </ScrollReveal>
            </div>
        </div>
    );
}
