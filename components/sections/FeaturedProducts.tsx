import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { RiArrowRightLine, RiExternalLinkLine, RiStarLine } from 'react-icons/ri';
import Image from 'next/image';
import type { Product } from '@/lib/firestore';

export default function FeaturedProducts({ products }: { products: Product[] }) {
    const display = products.slice(0, 3);

    return (
        <section className="py-24 px-6 bg-bg">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
                    <div>
                        <span className="bg-navy text-lime text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-4 inline-block">
                            Portfolio
                        </span>
                        <h2 className="font-display font-black text-4xl sm:text-5xl text-navy mt-3">
                            Products I've{' '}
                            <span className="relative inline-block">
                                Built
                                <span className="absolute -bottom-1 left-0 right-0 h-2.5 bg-lime/40 -z-10 rounded" />
                            </span>
                        </h2>
                        <p className="text-text-secondary mt-3 max-w-md">
                            From zero-to-one launches to scaling products to millions of users.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="btn-secondary px-5 py-2.5 text-sm rounded-xl flex items-center gap-2 self-start sm:self-auto shrink-0"
                    >
                        View All <RiArrowRightLine size={16} />
                    </Link>
                </ScrollReveal>

                {/* Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {display.map((product, i) => (
                        <ScrollReveal key={product.id} delay={i * 0.1} direction="up">
                            <div className="bg-white rounded-3xl overflow-hidden border border-border card-hover h-full flex flex-col group shadow-card">
                                {/* Image / placeholder */}
                                <div className="h-44 relative bg-mint/30 flex items-center justify-center overflow-hidden">
                                    {product.imageUrl ? (
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <span className="font-display font-black text-5xl text-navy/20 group-hover:text-navy/30 transition-opacity">
                                            {product.name ? product.name[0] : '✧'}
                                        </span>
                                    )}
                                    {product.featured && (
                                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-lime text-navy text-xs px-2.5 py-1 rounded-lg font-semibold shadow-sm">
                                            <RiStarLine size={10} /> Featured
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="font-display font-bold text-lg text-navy mb-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-text-secondary text-sm mb-3 leading-relaxed">
                                        {product.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto pt-3">
                                        {(product.tags ?? []).slice(0, 3).map((t) => (
                                            <span
                                                key={t}
                                                className="text-xs px-2.5 py-0.5 rounded-lg bg-lime/20 text-navy border border-lime/40"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    {product.link && product.link !== '#' && (
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 flex items-center gap-1.5 text-xs text-navy font-semibold hover:text-lime-dark transition-colors"
                                        >
                                            View Case Study <RiExternalLinkLine size={11} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
