import { getPublishedBlogs } from '@/lib/firestore';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Link from 'next/link';
import { RiCalendarLine, RiTimeLine, RiArrowRightLine } from 'react-icons/ri';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blogs — Archit Chandrakar',
    description: 'Product management insights and essays by Archit Chandrakar.',
};

export const dynamic = 'force-dynamic';

function readingTime(content: string) {
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
}

export default async function BlogsPage() {
    const data = await getPublishedBlogs().catch(() => []);

    const [featured, ...rest] = data;

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <ScrollReveal className="text-center mb-16">
                    <span className="glass border border-violet/30 text-violet-light text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-4 inline-block">Writing</span>
                    <h1 className="font-display font-black text-4xl sm:text-5xl text-text-primary mt-4">
                        Product <span className="gradient-text">Insights</span>
                    </h1>
                    <p className="text-text-secondary mt-4 max-w-xl mx-auto">
                        Essays, frameworks, and hard-won lessons from the product trenches.
                    </p>
                </ScrollReveal>

                {/* Featured post */}
                {featured && (
                    <ScrollReveal className="mb-8">
                        <Link href={`/blogs/${featured.slug}`}>
                            <div className="glass rounded-3xl overflow-hidden border border-white/6 card-hover grid md:grid-cols-2 gap-0">
                                <div className="h-56 md:h-auto relative bg-gradient-to-br from-violet/20 via-bg to-cyan/10 flex items-center justify-center p-8">
                                    {featured.coverImage ? (
                                        <Image src={featured.coverImage} alt={featured.title} fill className="object-cover" />
                                    ) : (
                                        <span className="font-display font-black text-7xl gradient-text opacity-20">✦</span>
                                    )}
                                    <div className="absolute top-4 left-4 glass border border-violet/30 text-violet-light text-xs font-semibold px-3 py-1 rounded-lg">
                                        Featured Post
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {featured.tags.map((t) => (
                                            <span key={t} className="text-xs px-2.5 py-0.5 rounded-lg bg-violet/10 text-violet-light border border-violet/15">{t}</span>
                                        ))}
                                    </div>
                                    <h2 className="font-display font-bold text-2xl text-text-primary leading-snug mb-3">{featured.title}</h2>
                                    <p className="text-text-secondary text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                                    <div className="flex items-center gap-4 text-text-muted text-xs">
                                        <span className="flex items-center gap-1"><RiCalendarLine size={12} />{new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="flex items-center gap-1"><RiTimeLine size={12} />{readingTime(featured.content)} min read</span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1.5 text-violet-light font-semibold text-sm">
                                        Read More <RiArrowRightLine size={14} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>
                )}

                {/* Rest of posts */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rest.map((post, i) => (
                        <ScrollReveal key={post.id} delay={i * 0.08} direction="up">
                            <Link href={`/blogs/${post.slug}`}>
                                <div className="glass rounded-2xl overflow-hidden border border-white/6 card-hover h-full flex flex-col">
                                    <div className="h-36 relative bg-gradient-to-br from-violet/10 via-bg to-cyan/5 flex items-center justify-center">
                                        {post.coverImage ? (
                                            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                                        ) : (
                                            <span className="font-display font-black text-4xl gradient-text opacity-20">✦</span>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {post.tags.slice(0, 2).map((t) => (
                                                <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-text-muted border border-white/8">{t}</span>
                                            ))}
                                        </div>
                                        <h3 className="font-display font-bold text-base text-text-primary leading-snug mb-2 flex-1">{post.title}</h3>
                                        <p className="text-text-muted text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                                        <div className="flex items-center justify-between text-text-muted text-xs">
                                            <span className="flex items-center gap-1"><RiCalendarLine size={11} />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                            <span className="flex items-center gap-1"><RiTimeLine size={11} />{readingTime(post.content)} min</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Empty State */}
                {data.length === 0 && (
                    <div className="glass rounded-2xl p-12 text-center border border-white/6 mt-12">
                        <p className="text-text-muted">No posts have been published yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
