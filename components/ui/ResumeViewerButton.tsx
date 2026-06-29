'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RiCloseLine, RiDownload2Line, RiEyeLine } from 'react-icons/ri';

export default function ResumeViewerButton({ url }: { url: string }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="btn-secondary px-6 py-2.5 text-sm rounded-xl flex items-center gap-2"
            >
                <RiEyeLine size={15} />
                View CV
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 16 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full h-full sm:w-[95vw] sm:max-w-6xl sm:h-[92vh] sm:rounded-2xl overflow-hidden bg-surface border border-border shadow-card-hover flex flex-col"
                        >
                            {/* Top bar */}
                            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-navy shrink-0">
                                <span className="text-white font-display font-semibold text-sm">Resume</span>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={url}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs font-semibold bg-lime text-navy px-3 py-1.5 rounded-lg hover:bg-lime/90 transition-colors"
                                    >
                                        <RiDownload2Line size={13} /> Download
                                    </a>
                                    <button
                                        onClick={() => setOpen(false)}
                                        aria-label="Close"
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <RiCloseLine size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Resume preview */}
                            <div className="relative flex-1 bg-white">
                                <iframe src={url} className="w-full h-full border-0" title="Resume preview" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
