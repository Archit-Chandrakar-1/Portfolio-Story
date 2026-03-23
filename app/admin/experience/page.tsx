'use client';
import { useState, useEffect } from 'react';
import { getExperiences, addDocument, updateDocument, deleteDocument, ExperienceEntry } from '@/lib/firestore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiDeleteBinLine, RiSaveLine, RiDraggable, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

const EMPTY: Omit<ExperienceEntry, 'id'> = {
    title: '', company: '', startDate: '', endDate: '', current: false,
    description: '', tags: [], order: 0, companyLogo: '',
};

export default function AdminExperiencePage() {
    const [items, setItems] = useState<ExperienceEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [newItem, setNewItem] = useState<Omit<ExperienceEntry, 'id'>>({ ...EMPTY });

    useEffect(() => {
        getExperiences().then(setItems).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const save = async (item: ExperienceEntry) => {
        if (!item.id) return;
        setSaving(item.id);
        try {
            const { id, ...data } = item;
            await updateDocument<ExperienceEntry>('experience', id, data);
            toast.success('Saved!');
        } catch { toast.error('Save failed.'); }
        finally { setSaving(null); }
    };

    const add = async () => {
        try {
            const id = await addDocument('experience', { ...newItem, order: items.length });
            setItems([...items, { ...newItem, id }]);
            setNewItem({ ...EMPTY });
            setAdding(false);
            toast.success('Entry added!');
        } catch { toast.error('Failed to add.'); }
    };

    const remove = async (id: string) => {
        if (!confirm('Delete this entry?')) return;
        try {
            await deleteDocument('experience', id);
            setItems(items.filter((i) => i.id !== id));
            toast.success('Deleted.');
        } catch { toast.error('Delete failed.'); }
    };

    const updateField = (id: string, field: keyof ExperienceEntry, value: unknown) => {
        setItems(items.map((i) => i.id === id ? { ...i, [field]: value } : i));
    };

    if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">Experience</h1>
                    <p className="text-text-muted text-sm mt-1">Manage your career timeline</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setAdding(true)}
                    className="btn-admin-save px-5 py-2.5 text-sm rounded-xl flex items-center gap-2">
                    <RiAddLine size={14} /> Add Entry
                </motion.button>
            </div>

            {/* Add form */}
            <AnimatePresence>
                {adding && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="glass rounded-2xl p-6 border border-violet/20 mb-5">
                        <h2 className="font-display font-semibold text-text-primary mb-4">New Experience Entry</h2>
                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                            {(['title', 'company', 'startDate', 'endDate'] as const).map((f) => (
                                <div key={f}>
                                    <label className="text-text-secondary text-xs font-medium block mb-1 capitalize">{f.replace(/([A-Z])/g, ' $1')}</label>
                                    <input value={newItem[f]} onChange={(e) => setNewItem({ ...newItem, [f]: e.target.value })}
                                        className="admin-input px-3 py-2 text-sm" placeholder={f} />
                                </div>
                            ))}
                        </div>
                        <div className="mb-3">
                            <label className="text-text-secondary text-xs font-medium block mb-1">Description</label>
                            <textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                rows={3} className="admin-input p-3 text-sm resize-none" />
                        </div>
                        <div className="mb-4">
                            <label className="text-text-secondary text-xs font-medium block mb-1">Tags (comma separated)</label>
                            <input value={newItem.tags.join(', ')} onChange={(e) => setNewItem({ ...newItem, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                className="admin-input px-3 py-2 text-sm" placeholder="Agile, Product Strategy" />
                        </div>
                        <label className="flex items-center gap-2 text-text-secondary text-sm mb-4 cursor-pointer">
                            <input type="checkbox" checked={newItem.current} onChange={(e) => setNewItem({ ...newItem, current: e.target.checked })}
                                className="accent-violet rounded" />
                            Currently working here
                        </label>
                        <div className="flex gap-3">
                            <button onClick={add} className="btn-admin-save px-5 py-2 text-sm rounded-xl flex items-center gap-2"><RiSaveLine size={13} />Save</button>
                            <button onClick={() => setAdding(false)} className="btn-secondary px-5 py-2 text-sm rounded-xl">Cancel</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Existing items */}
            <div className="space-y-4">
                {items.map((item, idx) => (
                    <div key={item.id} className="glass rounded-2xl border border-white/6 overflow-hidden">
                        <div className="flex items-start justify-between gap-4 px-6 py-4">
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <RiDraggable size={14} className="text-text-muted shrink-0" />
                                    <span className="text-xs text-text-muted shrink-0">#{idx + 1}</span>
                                    <h3 className="font-display font-semibold text-text-primary text-sm truncate">{item.title || 'Untitled'}</h3>
                                </div>
                                <span className="text-xs text-text-secondary pl-6">{item.company || 'No Company'}</span>
                            </div>
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
                                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                                            {(['title', 'company', 'startDate', 'endDate'] as const).map((f) => (
                                                <div key={f}>
                                                    <label className="text-text-secondary text-xs font-medium block mb-1 capitalize">{f.replace(/([A-Z])/g, ' $1')}</label>
                                                    <input value={item[f] || ''} onChange={(e) => updateField(item.id!, f, e.target.value)}
                                                        className="admin-input px-3 py-2 text-sm" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mb-3">
                                            <label className="text-text-secondary text-xs font-medium block mb-1">Description</label>
                                            <textarea value={item.description} onChange={(e) => updateField(item.id!, 'description', e.target.value)}
                                                rows={3} className="admin-input p-3 text-sm resize-none" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="text-text-secondary text-xs font-medium block mb-1">Tags (comma separated)</label>
                                            <input value={(item.tags ?? []).join(', ')} onChange={(e) => updateField(item.id!, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                                className="admin-input px-3 py-2 text-sm" />
                                        </div>
                                        <label className="flex items-center gap-2 text-text-secondary text-sm cursor-pointer">
                                            <input type="checkbox" checked={item.current} onChange={(e) => updateField(item.id!, 'current', e.target.checked)}
                                                className="accent-violet" />
                                            Currently working here
                                        </label>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="glass rounded-2xl p-12 border border-white/6 text-center text-text-muted">
                        No experience entries yet. Add your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
