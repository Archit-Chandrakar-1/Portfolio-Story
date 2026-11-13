'use client';
import { useState } from 'react';

interface Props {
    url: string;
    name: string;
}

export default function ProductCardPreview({ url, name }: Props) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative h-80 w-full overflow-hidden bg-white border-b border-white/6">
            {/* Mini browser chrome */}
            <div className="relative z-10 flex items-center gap-1.5 px-3 py-2 bg-navy border-b border-white/5">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="ml-2 text-[10px] text-white/50 truncate">{url.replace(/^https?:\/\//, '')}</span>
            </div>

            {/* Scaled, non-interactive snapshot of the live site */}
            <div className="relative w-full h-[calc(100%-28px)] overflow-hidden">
                <iframe
                    src={url}
                    title={`${name} preview`}
                    loading="lazy"
                    tabIndex={-1}
                    onLoad={() => setLoaded(true)}
                    className="absolute top-0 left-0 border-0 pointer-events-none origin-top-left"
                    style={{ width: '250%', height: '250%', transform: 'scale(0.4)' }}
                />
                {!loaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs text-navy/40">
                        Loading preview…
                    </div>
                )}
            </div>
        </div>
    );
}
