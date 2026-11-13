'use client';
import { useState, useEffect, useMemo } from 'react';
import {
    getAgentFacts, addDocument, updateDocument, deleteDocument,
    getExperiences, getProjects, getCertifications,
    AgentFact, FactCategory, RoleTrack, FactVisibility,
} from '@/lib/firestore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiAddLine, RiDeleteBinLine, RiSaveLine, RiEyeLine, RiEyeOffLine,
    RiDownloadLine, RiFileCopyLine, RiBrainLine, RiSparklingLine,
} from 'react-icons/ri';

const CATEGORIES: { value: FactCategory; label: string; prefix: string }[] = [
    { value: 'experience', label: 'Experience', prefix: 'EXP' },
    { value: 'project', label: 'Project', prefix: 'PRJ' },
    { value: 'skill', label: 'Skill', prefix: 'SKL' },
    { value: 'education', label: 'Education', prefix: 'EDU' },
    { value: 'certification', label: 'Certification', prefix: 'CRT' },
    { value: 'personal', label: 'Personal', prefix: 'PER' },
];

const TRACKS: { value: RoleTrack; label: string }[] = [
    { value: 'technical-pm', label: 'Technical PM' },
    { value: 'ai-pm', label: 'AI PM' },
    { value: 'both', label: 'Both' },
];

const VISIBILITY: { value: FactVisibility; label: string; hint: string }[] = [
    { value: 'public', label: 'Public', hint: 'Already on your portfolio or LinkedIn — safe anywhere.' },
    { value: 'private', label: 'Private', hint: 'Fine in a resume or email to one employer. Not for the open web.' },
    { value: 'interview-only', label: 'Interview only', hint: 'Never put in writing. Held for your recall and stripped from every export.' },
];

const EMPTY: Omit<AgentFact, 'id'> = {
    factId: '', category: 'experience', statement: '', context: '', metric: '',
    skills: [], tracks: ['both'], weight: 3, active: true,
    visibility: 'private', privateNote: '',
    createdAt: '', updatedAt: '',
};

/**
 * First unused citation key for a category, e.g. EXP-04. Mutates `used` so a
 * whole batch can be minted without collisions.
 */
function mintFactId(category: FactCategory, used: Set<string>) {
    const prefix = CATEGORIES.find((c) => c.value === category)?.prefix ?? 'FCT';
    let n = 1;
    let id = `${prefix}-${String(n).padStart(2, '0')}`;
    while (used.has(id)) {
        n += 1;
        id = `${prefix}-${String(n).padStart(2, '0')}`;
    }
    used.add(id);
    return id;
}

function nextFactId(category: FactCategory, existing: AgentFact[]) {
    return mintFactId(category, new Set(existing.map((f) => f.factId)));
}

/**
 * Break a portfolio description into atomic claims. Portfolio copy is written
 * as prose or bullets; the fact pool wants one checkable statement per entry,
 * so split on line breaks and bullet glyphs and drop fragments too short to
 * stand alone.
 */
function splitBullets(text: string): string[] {
    if (!text) return [];
    const plain = text.replace(/<[^>]+>/g, ' ');
    const segments = plain
        .split(/\r?\n+/)
        .flatMap((line) => line.split(/\s*[•▪·]\s*/))
        .map((s) => s.replace(/^[-–—*•]\s*/, '').replace(/\s+/g, ' ').trim())
        .filter((s) => s.length > 3);
    // Only treat it as a bullet list if it really split into several pieces —
    // otherwise a short one-liner would come back as a single stray fragment.
    if (segments.length > 1) return segments;
    const whole = plain.replace(/\s+/g, ' ').trim();
    return whole ? [whole] : [];
}

/**
 * Firebase throws opaque errors. Name the cause — and the fix — so a failure
 * says what to do instead of just "failed".
 */
function describeError(e: unknown): string {
    const code = (e as { code?: string })?.code;
    if (code === 'permission-denied') {
        return 'Firestore denied the request. The agentFacts rules are most likely not deployed yet — publish firestore.rules, then retry.';
    }
    if (code === 'unavailable') return 'Could not reach Firestore — check your connection.';
    if (code === 'unauthenticated') return 'You are signed out. Sign in again and retry.';
    return code || (e as Error)?.message || 'Unknown error.';
}

export default function AdminAgentPage() {
    const [items, setItems] = useState<AgentFact[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [newItem, setNewItem] = useState<Omit<AgentFact, 'id'>>({ ...EMPTY });
    const [filter, setFilter] = useState<FactCategory | 'all'>('all');
    const [seedPreview, setSeedPreview] = useState<Omit<AgentFact, 'id'>[] | null>(null);
    const [seedBusy, setSeedBusy] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        getAgentFacts()
            .then(setItems)
            .catch((e) => setLoadError(describeError(e)))
            .finally(() => setLoading(false));
    }, []);

    const visible = useMemo(
        () => filter === 'all' ? items : items.filter((i) => i.category === filter),
        [items, filter]
    );
    const activeCount = items.filter((i) => i.active).length;
    /** Active minus anything sealed as interview-only. */
    const exportable = useMemo(
        () => items.filter((i) => i.active && (i.visibility ?? 'private') !== 'interview-only'),
        [items]
    );
    const sealedCount = activeCount - exportable.length;

    const openAdd = () => {
        setNewItem({ ...EMPTY, factId: nextFactId('experience', items) });
        setAdding(true);
    };

    const add = async () => {
        if (!newItem.statement.trim()) {
            toast.error('A fact needs a statement.');
            return;
        }
        if (items.some((i) => i.factId === newItem.factId)) {
            toast.error(`${newItem.factId} is already taken.`);
            return;
        }
        const now = new Date().toISOString();
        const payload = { ...newItem, createdAt: now, updatedAt: now };
        try {
            const id = await addDocument('agentFacts', payload);
            setItems([...items, { ...payload, id }]);
            setAdding(false);
            toast.success(`${payload.factId} added to the pool.`);
        } catch (e) { toast.error(describeError(e)); }
    };

    const save = async (item: AgentFact) => {
        if (!item.id) return;
        setSaving(item.id);
        try {
            const { id, ...data } = { ...item, updatedAt: new Date().toISOString() };
            await updateDocument<AgentFact>('agentFacts', id!, data);
            setItems(items.map((i) => i.id === id ? { ...i, updatedAt: data.updatedAt } : i));
            toast.success('Saved!');
        } catch (e) { toast.error(describeError(e)); }
        finally { setSaving(null); }
    };

    const remove = async (id: string) => {
        if (!confirm('Delete this fact? The agent will lose access to it permanently.')) return;
        try {
            await deleteDocument('agentFacts', id);
            setItems(items.filter((i) => i.id !== id));
            toast.success('Deleted.');
        } catch (e) { toast.error(describeError(e)); }
    };

    /** Optimistic toggle — reverts if the write fails. */
    const toggleActive = async (item: AgentFact) => {
        if (!item.id) return;
        const next = !item.active;
        setItems(items.map((i) => i.id === item.id ? { ...i, active: next } : i));
        try {
            await updateDocument<AgentFact>('agentFacts', item.id, {
                active: next, updatedAt: new Date().toISOString(),
            });
        } catch (e) {
            setItems(items.map((i) => i.id === item.id ? { ...i, active: !next } : i));
            toast.error(describeError(e));
        }
    };

    const updateField = (id: string, field: keyof AgentFact, value: unknown) => {
        setItems(items.map((i) => i.id === id ? { ...i, [field]: value } : i));
    };

    // ── Seeding from existing portfolio content ───────────────────────────────
    // Your experience, products and certifications are already written down in
    // this admin. Rather than retyping them, pull them in as draft facts. They
    // arrive withheld so nothing reaches the agent before you have read it.

    const buildSeed = async () => {
        setSeedBusy(true);
        try {
            const [experiences, projects, certifications] = await Promise.all([
                getExperiences(), getProjects(), getCertifications(),
            ]);

            const seenSources = new Set(items.map((i) => i.source).filter(Boolean) as string[]);
            const usedIds = new Set(items.map((i) => i.factId));
            const now = new Date().toISOString();
            const drafts: Omit<AgentFact, 'id'>[] = [];

            const push = (
                category: FactCategory,
                statement: string,
                context: string,
                skills: string[],
                source: string,
            ) => {
                if (seenSources.has(source)) return;
                seenSources.add(source);
                drafts.push({
                    factId: mintFactId(category, usedIds),
                    category, statement, context, metric: '',
                    skills, tracks: ['both'], weight: 3, active: false,
                    visibility: 'public', privateNote: '',
                    source, createdAt: now, updatedAt: now,
                });
            };

            experiences.forEach((e) => {
                const context = [e.title, e.company].filter(Boolean).join(' — ');
                splitBullets(e.description).forEach((statement, idx) => {
                    push('experience', statement, context, e.tags ?? [], `experience:${e.id}#${idx}`);
                });
            });

            projects.forEach((p) => {
                splitBullets(p.longDescription || p.description).forEach((statement, idx) => {
                    push('project', statement, p.name ?? '', p.tags ?? [], `project:${p.id}#${idx}`);
                });
            });

            certifications.forEach((c) => {
                const statement = c.description?.trim()
                    ? c.description.trim()
                    : [c.name, c.issuer].filter(Boolean).join(' — ');
                push('certification', statement, c.issuer ?? '', [], `certification:${c.id}#0`);
            });

            if (!drafts.length) {
                toast('Nothing new to import — your portfolio is already in the pool.');
                return;
            }
            setSeedPreview(drafts);
        } catch (e) {
            toast.error(describeError(e));
        } finally {
            setSeedBusy(false);
        }
    };

    const importSeed = async () => {
        if (!seedPreview?.length) return;
        setSeedBusy(true);
        try {
            const created = await Promise.all(
                seedPreview.map(async (d) => ({ ...d, id: await addDocument('agentFacts', d) }))
            );
            setItems([...items, ...created]);
            setSeedPreview(null);
            toast.success(`${created.length} drafts imported — all withheld until you activate them.`);
        } catch (e) { toast.error(describeError(e), { duration: 8000 }); }
        finally { setSeedBusy(false); }
    };

    /**
     * Exactly what the n8n prompt should receive. Two gates: the fact must be
     * active, and it must not be interview-only. `privateNote` and the
     * visibility tier itself are stripped — they are bookkeeping, not content.
     */
    const buildPool = () => ({
        generatedAt: new Date().toISOString(),
        factCount: exportable.length,
        facts: exportable.map(
            ({ id, createdAt, updatedAt, active, source, visibility, privateNote, ...f }) => f
        ),
    });

    const copyPool = async () => {
        await navigator.clipboard.writeText(JSON.stringify(buildPool(), null, 2));
        toast.success(`${exportable.length} facts copied.`);
    };

    const downloadPool = () => {
        const blob = new Blob([JSON.stringify(buildPool(), null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fact-pool-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const toggleTrack = (current: RoleTrack[], track: RoleTrack) =>
        current.includes(track) ? current.filter((t) => t !== track) : [...current, track];

    if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div>
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary flex items-center gap-2">
                        <RiBrainLine size={22} className="text-violet-500" /> Agent Brain
                    </h1>
                    <p className="text-text-muted text-sm mt-1">
                        The only facts your job-application agent may use about you.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={buildSeed} disabled={seedBusy}
                        className="btn-secondary px-4 py-2 text-sm rounded-xl flex items-center gap-2">
                        <RiSparklingLine size={13} /> {seedBusy ? 'Reading…' : 'Seed from Portfolio'}
                    </button>
                    <button onClick={copyPool} className="btn-secondary px-4 py-2 text-sm rounded-xl flex items-center gap-2">
                        <RiFileCopyLine size={13} /> Copy JSON
                    </button>
                    <button onClick={downloadPool} className="btn-secondary px-4 py-2 text-sm rounded-xl flex items-center gap-2">
                        <RiDownloadLine size={13} /> Export
                    </button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={openAdd}
                        className="btn-admin-save px-5 py-2.5 text-sm rounded-xl flex items-center gap-2">
                        <RiAddLine size={14} /> Add Fact
                    </motion.button>
                </div>
            </div>

            {loadError && (
                <div className="glass rounded-2xl p-4 border border-red-500/30 bg-red-500/5 mb-5">
                    <p className="text-red-400 text-sm font-medium mb-1">Could not read the fact pool</p>
                    <p className="text-text-secondary text-xs">{loadError}</p>
                </div>
            )}

            {/* Grounding summary */}
            <div className="glass rounded-2xl p-4 border border-white/6 mb-5 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-text-secondary text-sm">
                    <span className="text-text-primary font-semibold">{exportable.length}</span> reach the agent
                    {items.length !== activeCount && (
                        <span className="text-text-muted"> · {items.length - activeCount} withheld</span>
                    )}
                    {sealedCount > 0 && (
                        <span className="text-amber-500/90"> · {sealedCount} interview-only</span>
                    )}
                    <span className="text-text-muted"> — nothing outside this set can be claimed.</span>
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                    <button onClick={() => setFilter('all')}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${filter === 'all' ? 'bg-violet-500/15 text-violet-500 border border-violet-500/25' : 'text-text-muted hover:text-text-primary'}`}>
                        All
                    </button>
                    {CATEGORIES.map((c) => (
                        <button key={c.value} onClick={() => setFilter(c.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${filter === c.value ? 'bg-violet-500/15 text-violet-500 border border-violet-500/25' : 'text-text-muted hover:text-text-primary'}`}>
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Seed preview */}
            <AnimatePresence>
                {seedPreview && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="glass rounded-2xl p-6 border border-cyan-500/25 mb-5">
                        <h2 className="font-display font-semibold text-text-primary mb-1">
                            {seedPreview.length} drafts from your portfolio
                        </h2>
                        <p className="text-text-muted text-xs mb-4">
                            Pulled from Experience, Products and Certifications. They import as{' '}
                            <span className="text-text-secondary">withheld</span> — read each one, sharpen the
                            wording, add a metric, then flip it to Active.
                        </p>
                        <div className="max-h-80 overflow-y-auto space-y-2 mb-4 pr-1">
                            {seedPreview.map((d) => (
                                <div key={d.factId} className="rounded-xl bg-white/5 px-3 py-2">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs font-mono text-cyan-600">{d.factId}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-text-muted">{d.category}</span>
                                    </div>
                                    <p className="text-sm text-text-primary">{d.statement}</p>
                                    {d.context && <p className="text-xs text-text-muted mt-0.5">{d.context}</p>}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={importSeed} disabled={seedBusy}
                                className="btn-admin-save px-5 py-2 text-sm rounded-xl flex items-center gap-2">
                                <RiSaveLine size={13} />{seedBusy ? 'Importing…' : `Import ${seedPreview.length}`}
                            </button>
                            <button onClick={() => setSeedPreview(null)} className="btn-secondary px-5 py-2 text-sm rounded-xl">
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add form */}
            <AnimatePresence>
                {adding && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="glass rounded-2xl p-6 border border-violet-500/25 mb-5">
                        <h2 className="font-display font-semibold text-text-primary mb-4">New Fact</h2>

                        <div className="grid sm:grid-cols-3 gap-3 mb-3">
                            <div>
                                <label className="text-text-secondary text-xs font-medium block mb-1">Category</label>
                                <select value={newItem.category}
                                    onChange={(e) => {
                                        const category = e.target.value as FactCategory;
                                        setNewItem({ ...newItem, category, factId: nextFactId(category, items) });
                                    }}
                                    className="admin-input px-3 py-2 text-sm">
                                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-text-secondary text-xs font-medium block mb-1">Fact ID</label>
                                <input value={newItem.factId} onChange={(e) => setNewItem({ ...newItem, factId: e.target.value })}
                                    className="admin-input px-3 py-2 text-sm font-mono" />
                            </div>
                            <div>
                                <label className="text-text-secondary text-xs font-medium block mb-1">Weight (1–5)</label>
                                <input type="number" min={1} max={5} value={newItem.weight}
                                    onChange={(e) => setNewItem({ ...newItem, weight: Number(e.target.value) })}
                                    className="admin-input px-3 py-2 text-sm" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="text-text-secondary text-xs font-medium block mb-1">Statement</label>
                            <textarea value={newItem.statement} onChange={(e) => setNewItem({ ...newItem, statement: e.target.value })}
                                rows={2} className="admin-input p-3 text-sm resize-none"
                                placeholder="Shipped the approval flow that cut manual review time for the ops team." />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="text-text-secondary text-xs font-medium block mb-1">Context</label>
                                <input value={newItem.context} onChange={(e) => setNewItem({ ...newItem, context: e.target.value })}
                                    className="admin-input px-3 py-2 text-sm" placeholder="Pyxidia Techlab — Associate TPM" />
                            </div>
                            <div>
                                <label className="text-text-secondary text-xs font-medium block mb-1">Metric (Optional)</label>
                                <input value={newItem.metric} onChange={(e) => setNewItem({ ...newItem, metric: e.target.value })}
                                    className="admin-input px-3 py-2 text-sm" placeholder="40% fewer review cycles" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="text-text-secondary text-xs font-medium block mb-1">Skills (comma separated)</label>
                            <input value={newItem.skills.join(', ')}
                                onChange={(e) => setNewItem({ ...newItem, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                                className="admin-input px-3 py-2 text-sm" placeholder="Roadmapping, SQL, Stakeholder Management" />
                        </div>

                        <div className="mb-3">
                            <label className="text-text-secondary text-xs font-medium block mb-1">Visibility</label>
                            <select value={newItem.visibility}
                                onChange={(e) => setNewItem({ ...newItem, visibility: e.target.value as FactVisibility })}
                                className="admin-input px-3 py-2 text-sm">
                                {VISIBILITY.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                            </select>
                            <p className="text-text-muted text-[11px] mt-1">
                                {VISIBILITY.find((v) => v.value === newItem.visibility)?.hint}
                            </p>
                        </div>

                        <div className="mb-3">
                            <label className="text-text-secondary text-xs font-medium block mb-1">Private Note (Optional)</label>
                            <textarea value={newItem.privateNote || ''}
                                onChange={(e) => setNewItem({ ...newItem, privateNote: e.target.value })}
                                rows={2} className="admin-input p-3 text-sm resize-none"
                                placeholder="Real client name, exact figures — your eyes only. Never exported, never sent to the agent." />
                        </div>

                        <div className="mb-4">
                            <label className="text-text-secondary text-xs font-medium block mb-2">Supports which narrative</label>
                            <div className="flex gap-2 flex-wrap">
                                {TRACKS.map((t) => (
                                    <button key={t.value} type="button"
                                        onClick={() => setNewItem({ ...newItem, tracks: toggleTrack(newItem.tracks, t.value) })}
                                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${newItem.tracks.includes(t.value)
                                            ? 'bg-violet-500/15 text-violet-500 border-violet-500/25'
                                            : 'text-text-muted border-white/10 hover:text-text-primary'}`}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={add} className="btn-admin-save px-5 py-2 text-sm rounded-xl flex items-center gap-2"><RiSaveLine size={13} />Save</button>
                            <button onClick={() => setAdding(false)} className="btn-secondary px-5 py-2 text-sm rounded-xl">Cancel</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fact list */}
            <div className="space-y-4">
                {visible.map((item) => (
                    <div key={item.id} className={`glass rounded-2xl border overflow-hidden transition-opacity ${item.active ? 'border-white/6' : 'border-white/6 opacity-50'}`}>
                        <div className="flex items-start justify-between gap-4 px-6 py-4">
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-xs font-mono text-violet-500 shrink-0">{item.factId}</span>
                                    <span className="text-[10px] uppercase tracking-wider text-text-muted px-1.5 py-0.5 rounded bg-white/5">
                                        {item.category}
                                    </span>
                                    <span className="text-[10px] text-text-muted">w{item.weight}</span>
                                    {(item.visibility ?? 'private') !== 'public' && (
                                        <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${item.visibility === 'interview-only'
                                            ? 'text-amber-500 border-amber-500/30 bg-amber-500/10'
                                            : 'text-text-muted border-white/10'}`}>
                                            {item.visibility === 'interview-only' ? 'interview only' : 'private'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-text-primary truncate">{item.statement || 'Empty fact'}</p>
                                {item.context && <span className="text-xs text-text-muted mt-0.5">{item.context}</span>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => toggleActive(item)}
                                    title={item.active ? 'Withhold from agent' : 'Allow agent to use'}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${item.active
                                        ? 'text-violet-500 border-violet-500/25 bg-violet-500/10'
                                        : 'text-text-muted border-white/10'}`}>
                                    {item.active ? 'Active' : 'Withheld'}
                                </button>
                                <button onClick={() => setExpanded(expanded === item.id ? null : item.id!)}
                                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-text-secondary">
                                    {expanded === item.id ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
                                </button>
                                <button onClick={() => save(item)} disabled={saving === item.id}
                                    className="btn-admin-save px-3 py-1.5 text-xs rounded-xl flex items-center gap-1">
                                    <RiSaveLine size={10} />{saving === item.id ? '…' : 'Save'}
                                </button>
                                <button onClick={() => remove(item.id!)} className="btn-admin-delete p-1.5 rounded-lg">
                                    <RiDeleteBinLine size={13} />
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expanded === item.id && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                    <div className="px-6 pb-6 border-t border-white/5 pt-4">
                                        <div className="grid sm:grid-cols-3 gap-3 mb-3">
                                            <div>
                                                <label className="text-text-secondary text-xs font-medium block mb-1">Category</label>
                                                <select value={item.category}
                                                    onChange={(e) => updateField(item.id!, 'category', e.target.value as FactCategory)}
                                                    className="admin-input px-3 py-2 text-sm">
                                                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-text-secondary text-xs font-medium block mb-1">Fact ID</label>
                                                <input value={item.factId} onChange={(e) => updateField(item.id!, 'factId', e.target.value)}
                                                    className="admin-input px-3 py-2 text-sm font-mono" />
                                            </div>
                                            <div>
                                                <label className="text-text-secondary text-xs font-medium block mb-1">Weight (1–5)</label>
                                                <input type="number" min={1} max={5} value={item.weight}
                                                    onChange={(e) => updateField(item.id!, 'weight', Number(e.target.value))}
                                                    className="admin-input px-3 py-2 text-sm" />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-text-secondary text-xs font-medium block mb-1">Statement</label>
                                            <textarea value={item.statement} onChange={(e) => updateField(item.id!, 'statement', e.target.value)}
                                                rows={2} className="admin-input p-3 text-sm resize-none" />
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <label className="text-text-secondary text-xs font-medium block mb-1">Context</label>
                                                <input value={item.context || ''} onChange={(e) => updateField(item.id!, 'context', e.target.value)}
                                                    className="admin-input px-3 py-2 text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-text-secondary text-xs font-medium block mb-1">Metric (Optional)</label>
                                                <input value={item.metric || ''} onChange={(e) => updateField(item.id!, 'metric', e.target.value)}
                                                    className="admin-input px-3 py-2 text-sm" />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-text-secondary text-xs font-medium block mb-1">Skills (comma separated)</label>
                                            <input value={(item.skills ?? []).join(', ')}
                                                onChange={(e) => updateField(item.id!, 'skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                                                className="admin-input px-3 py-2 text-sm" />
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-text-secondary text-xs font-medium block mb-1">Visibility</label>
                                            <select value={item.visibility ?? 'private'}
                                                onChange={(e) => updateField(item.id!, 'visibility', e.target.value as FactVisibility)}
                                                className="admin-input px-3 py-2 text-sm">
                                                {VISIBILITY.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                                            </select>
                                            <p className="text-text-muted text-[11px] mt-1">
                                                {VISIBILITY.find((v) => v.value === (item.visibility ?? 'private'))?.hint}
                                            </p>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-text-secondary text-xs font-medium block mb-1">Private Note (Optional)</label>
                                            <textarea value={item.privateNote || ''}
                                                onChange={(e) => updateField(item.id!, 'privateNote', e.target.value)}
                                                rows={2} className="admin-input p-3 text-sm resize-none"
                                                placeholder="Real client name, exact figures — your eyes only. Never exported." />
                                        </div>

                                        <div>
                                            <label className="text-text-secondary text-xs font-medium block mb-2">Supports which narrative</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {TRACKS.map((t) => (
                                                    <button key={t.value} type="button"
                                                        onClick={() => updateField(item.id!, 'tracks', toggleTrack(item.tracks ?? [], t.value))}
                                                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${(item.tracks ?? []).includes(t.value)
                                                            ? 'bg-violet-500/15 text-violet-500 border-violet-500/25'
                                                            : 'text-text-muted border-white/10 hover:text-text-primary'}`}>
                                                        {t.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                {visible.length === 0 && (
                    <div className="glass rounded-2xl p-12 border border-white/6 text-center text-text-muted">
                        {items.length === 0
                            ? 'Nothing taught yet. Add your first fact — the agent can only speak from this pool.'
                            : 'No facts in this category.'}
                    </div>
                )}
            </div>
        </div>
    );
}
