'use client';
import { useState, useEffect } from 'react';
import { getWorkflows, addDocument, updateDocument, deleteDocument, Workflow, WorkflowNode, WorkflowTag, WorkflowCaseStudy } from '@/lib/firestore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiDeleteBinLine, RiSaveLine, RiEyeLine, RiEyeOffLine, RiDragMove2Line } from 'react-icons/ri';

const EMPTY_CASE_STUDY: WorkflowCaseStudy = {
    why: { heading: '', body: '' },
    how: { heading: '', body: '' },
    results: { heading: '', body: '' },
};

const EMPTY: Omit<Workflow, 'id'> = {
    title: '', description: '', problem: '', outcome: '',
    tags: [], imageUrl: '', tool: '', impact: '', nodes: [],
    liveLink: '', githubLink: '', notionLink: '', order: 0,
    caseStudy: { ...EMPTY_CASE_STUDY },
};

const TextField = ({ label, value, onChange, type = 'text', rows }: { label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number }) => (
    <div>
        <label className="text-text-secondary text-xs font-medium block mb-1">{label}</label>
        {rows ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className="admin-input p-3 text-sm resize-none" />
            : <input type={type} value={value} onChange={e => onChange(e.target.value)} className="admin-input px-3 py-2 text-sm" />}
    </div>
);

const NodeEditor = ({ nodes, onChange }: { nodes: WorkflowNode[]; onChange: (n: WorkflowNode[]) => void }) => {
    const addNode = () => onChange([...nodes, { icon: '🤖', label: 'New Node', tool: 'Tool' }]);
    const updateNode = (index: number, field: keyof WorkflowNode, value: string) => {
        const newNodes = [...nodes];
        newNodes[index] = { ...newNodes[index], [field]: value };
        onChange(newNodes);
    };
    const removeNode = (index: number) => {
        onChange(nodes.filter((_, i) => i !== index));
    };

    return (
        <div className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-text-secondary text-xs font-medium">Pipeline Nodes</label>
                <button onClick={addNode} className="btn-secondary px-3 py-1.5 text-xs rounded-lg flex items-center gap-1">
                    <RiAddLine size={12} /> Add Node
                </button>
            </div>
            {nodes.length === 0 && <p className="text-text-muted text-xs">No nodes added yet.</p>}
            <div className="space-y-2">
                {nodes.map((node, i) => (
                    <div key={i} className="flex items-center gap-2 bg-bg p-2 rounded-lg border border-white/5">
                        <RiDragMove2Line size={14} className="text-text-muted shrink-0 cursor-grab" />
                        <input type="text" value={node.icon} onChange={e => updateNode(i, 'icon', e.target.value)} className="admin-input px-2 py-1 text-xs w-12 text-center" placeholder="Icon" title="Emoji or Icon" />
                        <input type="text" value={node.label} onChange={e => updateNode(i, 'label', e.target.value)} className="admin-input px-2 py-1 text-xs flex-1" placeholder="Label (e.g. Extract Data)" />
                        <input type="text" value={node.tool} onChange={e => updateNode(i, 'tool', e.target.value)} className="admin-input px-2 py-1 text-xs flex-1" placeholder="Tool (e.g. OpenAI)" />
                        <button onClick={() => removeNode(i)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <RiDeleteBinLine size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CaseStudyEditor = ({ caseStudy, onChange }: { caseStudy: WorkflowCaseStudy; onChange: (cs: WorkflowCaseStudy) => void }) => {
    const sections: { key: keyof WorkflowCaseStudy; label: string }[] = [
        { key: 'why', label: 'Why (the problem)' },
        { key: 'how', label: 'How (the build)' },
        { key: 'results', label: 'Results (the outcome)' },
    ];

    return (
        <div className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-4">
            <label className="text-text-secondary text-xs font-medium block">
                Case Study (powers the full /workflows/[id] page — leave blank to skip)
            </label>
            {sections.map(({ key, label }) => (
                <div key={key} className="grid sm:grid-cols-2 gap-2 border-t border-white/5 pt-3 first:border-t-0 first:pt-0">
                    <input
                        type="text"
                        value={caseStudy[key].heading}
                        onChange={e => onChange({ ...caseStudy, [key]: { ...caseStudy[key], heading: e.target.value } })}
                        className="admin-input px-3 py-2 text-sm sm:col-span-2"
                        placeholder={`${label} — heading`}
                    />
                    <textarea
                        value={caseStudy[key].body}
                        onChange={e => onChange({ ...caseStudy, [key]: { ...caseStudy[key], body: e.target.value } })}
                        rows={3}
                        className="admin-input p-3 text-sm resize-none sm:col-span-2"
                        placeholder={`${label} — body`}
                    />
                </div>
            ))}
        </div>
    );
};

const ItemForm = ({ data, set, onSave, onCancel, saveLabel }: { data: Omit<Workflow, 'id'>; set: (d: Omit<Workflow, 'id'>) => void; onSave: () => void; onCancel: () => void; saveLabel: string }) => (
    <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
            <TextField label="Title" value={data.title} onChange={v => set({ ...data, title: v })} />
            <TextField label="Primary Tool" value={data.tool} onChange={v => set({ ...data, tool: v })} />
            <TextField label="Impact Metric (e.g. +40% Speed)" value={data.impact} onChange={v => set({ ...data, impact: v })} />
            <TextField label="Image URL (Optional screenshot)" value={data.imageUrl || ''} onChange={v => set({ ...data, imageUrl: v })} type="url" />
        </div>
        
        <TextField label="Short Description" value={data.description} onChange={v => set({ ...data, description: v })} rows={2} />
        
        <div className="grid sm:grid-cols-2 gap-3">
            <TextField label="Problem" value={data.problem} onChange={v => set({ ...data, problem: v })} rows={3} />
            <TextField label="Outcome" value={data.outcome} onChange={v => set({ ...data, outcome: v })} rows={3} />
        </div>

        <NodeEditor nodes={data.nodes} onChange={nodes => set({ ...data, nodes })} />

        <CaseStudyEditor caseStudy={data.caseStudy ?? EMPTY_CASE_STUDY} onChange={caseStudy => set({ ...data, caseStudy })} />

        <div className="grid sm:grid-cols-3 gap-3">
            <TextField label="Live Link (Optional)" value={data.liveLink || ''} onChange={v => set({ ...data, liveLink: v })} type="url" />
            <TextField label="GitHub Link (Optional)" value={data.githubLink || ''} onChange={v => set({ ...data, githubLink: v })} type="url" />
            <TextField label="Notion Link (Optional)" value={data.notionLink || ''} onChange={v => set({ ...data, notionLink: v })} type="url" />
        </div>

        <TextField label="Tags (comma separated, e.g. AI, Automation, Analytics, Research, GTM)" value={(data.tags ?? []).join(', ')} onChange={v => set({ ...data, tags: v.split(',').map(t => t.trim()).filter(Boolean) as WorkflowTag[] })} />
        
        <div className="flex gap-3 pt-2">
            <button onClick={onSave} className="btn-admin-save px-5 py-2 text-sm rounded-xl flex items-center gap-2"><RiSaveLine size={13} />{saveLabel}</button>
            <button onClick={onCancel} className="btn-secondary px-5 py-2 text-sm rounded-xl">Cancel</button>
        </div>
    </div>
);

export default function AdminWorkflowsPage() {
    const [items, setItems] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [newItem, setNewItem] = useState<Omit<Workflow, 'id'>>({ ...EMPTY });

    useEffect(() => { getWorkflows().then(setItems).finally(() => setLoading(false)); }, []);

    const save = async (item: Workflow) => {
        if (!item.id) return;
        setSaving(item.id);
        try { const { id, ...data } = item; await updateDocument('workflows', id, data); toast.success('Saved!'); }
        catch { toast.error('Save failed.'); }
        finally { setSaving(null); }
    };

    const add = async () => {
        try {
            const id = await addDocument('workflows', { ...newItem, order: items.length });
            setItems([...items, { ...newItem, id }]);
            setNewItem({ ...EMPTY }); setAdding(false); toast.success('Workflow added!');
        } catch { toast.error('Failed.'); }
    };

    const remove = async (id: string) => {
        if (!confirm('Delete this workflow?')) return;
        try { await deleteDocument('workflows', id); setItems(items.filter(i => i.id !== id)); toast.success('Deleted.'); }
        catch { toast.error('Failed.'); }
    };

    if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">Workflows</h1>
                    <p className="text-text-muted text-sm mt-1">Manage your automated workflows and pipelines</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setAdding(true)} className="btn-admin-save px-5 py-2.5 text-sm rounded-xl flex items-center gap-2">
                    <RiAddLine size={14} />Add Workflow
                </motion.button>
            </div>

            <AnimatePresence>
                {adding && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="glass rounded-2xl p-6 border border-violet-500/25 mb-5">
                        <h2 className="font-display font-semibold text-text-primary mb-4">New Workflow</h2>
                        <ItemForm data={newItem} set={setNewItem} onSave={add} onCancel={() => setAdding(false)} saveLabel="Add" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="glass rounded-2xl border border-white/6 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4">
                            <h3 className="font-display font-semibold text-text-primary text-sm truncate flex-1">{item.title || 'Untitled'}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => setExpanded(expanded === item.id ? null : item.id!)}
                                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-text-secondary">
                                    {expanded === item.id ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
                                </button>
                                <button onClick={() => save(item)} disabled={saving === item.id}
                                    className="btn-admin-save px-3 py-1.5 text-xs rounded-xl flex items-center gap-1">
                                    <RiSaveLine size={10} />{saving === item.id ? '…' : 'Save'}
                                </button>
                                <button onClick={() => remove(item.id!)}
                                    className="btn-admin-delete p-1.5 rounded-lg">
                                    <RiDeleteBinLine size={13} />
                                </button>
                            </div>
                        </div>
                        <AnimatePresence>
                            {expanded === item.id && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                    <div className="px-6 pb-6 border-t border-white/5 pt-4">
                                        <ItemForm
                                            data={item as Omit<Workflow, 'id'>}
                                            set={(d) => setItems(items.map(i => i.id === item.id ? { ...d, id: item.id } : i))}
                                            onSave={() => save(item)} onCancel={() => setExpanded(null)} saveLabel="Save"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
                {items.length === 0 && <div className="glass rounded-2xl p-12 border border-white/6 text-center text-text-muted">No workflows yet.</div>}
            </div>
        </div>
    );
}
