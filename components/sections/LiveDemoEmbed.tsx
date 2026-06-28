'use client';
import { useState } from 'react';
import { RiExternalLinkLine, RiLoader4Line } from 'react-icons/ri';

interface Props {
    url: string;
}

export default function LiveDemoEmbed({ url }: Props) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative w-full h-[92vh] min-h-[750px] rounded-2xl overflow-hidden bg-surface border border-border shadow-card-hover flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-navy shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-lime/70 shrink-0" />
                    <span className="text-white/70 text-xs truncate">{url}</span>
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-lime transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5 shrink-0"
                >
                    Open in new tab <RiExternalLinkLine size={13} />
                </a>
            </div>

            {/* Iframe — renders immediately; a small corner badge shows until "load" fires,
                instead of an opaque overlay that hides the page's own progressive paint. */}
            <div className="relative flex-1 bg-white">
                <iframe
                    src={url}
                    className="w-full h-full border-0"
                    onLoad={() => setLoaded(true)}
                    title="Live product demo"
                />
                {!loaded && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-navy/90 text-white/80 text-xs px-3 py-1.5 rounded-lg pointer-events-none">
                        <RiLoader4Line size={14} className="animate-spin text-lime" />
                        Loading…
                    </div>
                )}
            </div>
        </div>
    );
}
