import { getDocument, Product } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowLeftLine, RiExternalLinkLine, RiFileList3Line } from 'react-icons/ri';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
    const product = await getDocument<Product>(`projects/${params.id}`);
    if (!product) return { title: 'Product Not Found' };
    return {
        title: `${product.name} — Archit Chandrakar`,
        description: product.description,
    };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getDocument<Product>(`projects/${params.id}`);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <ScrollReveal>
                    <Link href="/products" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 text-sm font-medium">
                        <RiArrowLeftLine size={16} /> Back to Products
                    </Link>

                    <div className="glass rounded-3xl overflow-hidden border border-white/6 mb-12 shadow-card">
                        {/* Image Header */}
                        <div className="h-64 sm:h-80 relative bg-gradient-to-br from-violet/20 via-bg to-cyan/10 flex items-center justify-center">
                            {product.imageUrl ? (
                                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            ) : (
                                <span className="font-display font-black text-6xl gradient-text opacity-40">{product.name ? product.name[0] : '✧'}</span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 sm:p-10">
                            <h1 className="font-display font-black text-3xl sm:text-5xl text-text-primary mb-3">{product.name}</h1>
                            <p className="text-text-secondary text-lg sm:text-xl mb-6">{product.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-10">
                                {product.tags?.map((t) => (
                                    <span key={t} className="text-sm px-3 py-1 rounded-lg bg-cyan/10 text-cyan-light border border-cyan/15">{t}</span>
                                ))}
                            </div>

                            <div className="prose prose-invert max-w-none text-text-muted leading-relaxed mb-10 whitespace-pre-wrap">
                                {product.longDescription || 'No detailed description available.'}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 border-t border-white/5 pt-8">
                                {product.link && product.link !== '#' && (
                                    <a href={product.link} target="_blank" rel="noopener noreferrer"
                                       className="btn-primary px-6 py-3 text-sm rounded-xl flex items-center gap-2">
                                        <RiExternalLinkLine size={16} /> View Project
                                    </a>
                                )}
                                {product.prdUrl && (
                                    <a href={product.prdUrl} target="_blank" rel="noopener noreferrer"
                                       className="btn-secondary px-6 py-3 text-sm rounded-xl flex items-center gap-2 border border-white/10 hover:bg-white/5 transition-colors">
                                        <RiFileList3Line size={16} /> View PRD
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
