'use client';
import { motion } from 'framer-motion';
import type { WorkflowNode } from '@/lib/firestore';

interface Props {
    nodes: WorkflowNode[];
    size?: 'compact' | 'large';
}

export default function WorkflowTimeline({ nodes, size = 'compact' }: Props) {
    const isLarge = size === 'large';
    const iconBox = isLarge ? 'w-14 h-14 text-2xl' : 'w-9 h-9 text-base';
    const labelText = isLarge ? 'text-xs' : 'text-[10px]';
    const toolText = isLarge ? 'text-[11px]' : 'text-[9px]';
    const connectorWidth = isLarge ? 'w-10 sm:w-16' : 'w-3';
    const connectorMarginTop = isLarge ? 27 : 17;
    const maxLabelWidth = isLarge ? 'max-w-[80px]' : 'max-w-[48px]';

    return (
        <div className="flex items-start gap-0 flex-wrap">
            {nodes.map((node, i) => (
                <div key={i} className="flex items-start">
                    {/* Node */}
                    <div className="flex flex-col items-center gap-1.5">
                        <div className={`${iconBox} rounded-xl bg-mint/40 border border-border flex items-center justify-center shrink-0`}>
                            {node.icon}
                        </div>
                        <span className={`${labelText} font-medium text-navy leading-tight text-center ${maxLabelWidth}`}>
                            {node.label}
                        </span>
                        <span className={`${toolText} text-text-secondary`}>
                            {node.tool}
                        </span>
                    </div>

                    {/* Connector with flowing pulse */}
                    {i < nodes.length - 1 && (
                        <div
                            className={`relative ${connectorWidth} h-px bg-border mx-1.5 shrink-0`}
                            style={{ marginTop: connectorMarginTop }}
                        >
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime shadow-lime"
                                animate={{ left: ['0%', '100%'] }}
                                transition={{
                                    duration: 1.4,
                                    repeat: Infinity,
                                    ease: 'linear',
                                    delay: i * 0.15,
                                }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
