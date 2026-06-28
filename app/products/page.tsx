import { getProjects } from '@/lib/firestore';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProductsHeroVideo from '@/components/sections/ProductsHeroVideo';
import { RiExternalLinkLine, RiStarLine, RiArrowRightLine } from 'react-icons/ri';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Products — Archit Chandrakar',
    description: 'Products and projects built by Archit Chandrakar.',
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const data = await getProjects().catch(() => []);

    const featured = data.filter((p) => p.featured);
    const rest = data.filter((p) => !p.featured);

    return (
        <div className="min-h-screen pb-20">
            {/* Hero with scrubbing video background */}
            <section className="relative w-full h-[60vh] sm:h-[65vh] min-h-[420px] flex items-center justify-center overflow-hidden pt-20">
                <ProductsHeroVideo />
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <ScrollReveal className="text-center">
                        <span className="glass border border-violet/30 text-violet-light text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-4 inline-block">Portfolio</span>
                        <h1 className="font-display font-black text-4xl sm:text-5xl text-text-primary mt-4">
                            Products I've <span className="gradient-text">Built</span>
                        </h1>
                        <p className="text-text-secondary mt-4 max-w-xl mx-auto">
                            A selection of products I've led from concept to launch, each with a story of discovery, design, and delivery.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 mt-16">
                {/* Featured products */}
                {featured.length > 0 && (
                    <div className="grid lg:grid-cols-2 gap-6 mb-8">
                        {featured.map((product, i) => (
                            <ScrollReveal key={product.id} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
                                <Link href={`/products/${product.id}`} className="block h-full cursor-pointer group">
                                    <div className="glass rounded-3xl overflow-hidden border border-white/6 card-hover h-full flex flex-col transition-all duration-300 group-hover:bg-white/5">
                                    {/* Image / placeholder */}
                                    <div className="h-44 relative bg-gradient-to-br from-violet/20 via-bg to-cyan/10 flex items-center justify-center">
                                        {product.imageUrl ? (
                                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <span className="font-display font-black text-4xl gradient-text opacity-40">{product.name ? product.name[0] : '✧'}</span>
                                        )}
                                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-violet/20 border border-violet/30 text-violet-light text-xs px-2.5 py-1 rounded-lg">
                                            <RiStarLine size={11} />
                                            Featured
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <h2 className="font-display font-bold text-xl text-text-primary mb-1">{product.name}</h2>
                                        <p className="text-text-secondary text-sm mb-3">{product.description}</p>
                                        <p className="text-text-muted text-sm leading-relaxed flex-1">{product.longDescription}</p>

                                        <div className="mt-4 flex flex-wrap gap-2 mb-5">
                                            {product.tags?.map((t) => (
                                                <span key={t} className="text-xs px-2.5 py-0.5 rounded-lg bg-cyan/10 text-cyan-light border border-cyan/15">{t}</span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm font-semibold text-violet-light group-hover:text-white transition-colors mt-auto">
                                            View Details <RiArrowRightLine size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                )}

                {/* Rest */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rest.map((product, i) => (
                        <ScrollReveal key={product.id} delay={i * 0.08} direction="up">
                            <Link href={`/products/${product.id}`} className="block h-full cursor-pointer group">
                                <div className="glass rounded-2xl p-6 border border-white/6 card-hover h-full flex flex-col transition-all duration-300 group-hover:bg-white/5">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet/20 to-cyan/10 border border-white/8 flex items-center justify-center mb-4">
                                    <span className="font-display font-black text-lg gradient-text">{product.name ? product.name[0] : '✧'}</span>
                                </div>
                                <h3 className="font-display font-bold text-lg text-text-primary mb-1">{product.name}</h3>
                                <p className="text-text-secondary text-sm mb-3">{product.description}</p>
                                <p className="text-text-muted text-sm leading-relaxed flex-1">{product.longDescription}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {product.tags?.map((t) => (
                                        <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-text-muted border border-white/8">{t}</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-violet-light group-hover:text-white transition-colors mt-5">
                                    View Details <RiArrowRightLine size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Empty State */}
                {data.length === 0 && (
                    <div className="glass rounded-2xl p-12 text-center border border-white/6 mt-12">
                        <p className="text-text-muted">No products have been added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
