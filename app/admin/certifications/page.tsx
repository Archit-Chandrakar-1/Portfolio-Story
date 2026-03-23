'use client';
import { useState, useEffect } from 'react';
import { getCertifications, addDocument, updateDocument, deleteDocument, Certification } from '@/lib/firestore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiDeleteBinLine, RiSaveLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

const EMPTY: Omit<Certification, 'id'> = { name: '', issuer: '', date: '', credentialUrl: '', badgeUrl: '', description: '', order: 0 };

const F = ({ label, id, value, set }: { label: string; id?: string; value: string; set: (v: string) => void }) => (
    <div>
        <label className="text-text-secondary text-xs font-medium block mb-1">{label}</label>
        <input value={value} onChange={e => set(e.target.value)} className="admin-input px-3 py-2 text-sm" />
    </div>
);

const Form = ({ data, set, onSave, saveLabel, onCancel }: any) => (
    <div className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
            <F label="Certification Name" value={data.name} set={(v: string) => set({ ...data, name: v })} />
            <F label="Issuing Organization" value={data.issuer} set={(v: string) => set({ ...data, issuer: v })} />
            <F label="Date (e.g. 2023)" value={data.date} set={(v: string) => set({ ...data, date: v })} />
            <F label="Credential URL" value={data.credentialUrl} set={(v: string) => set({ ...data, credentialUrl: v })} />
            <F label="Badge Image URL" value={data.badgeUrl || ''} set={(v: string) => set({ ...data, badgeUrl: v })} />
        </div>
        <div>
            <label className="text-text-secondary text-xs font-medium block mb-1">Description</label>
            <textarea value={data.description} onChange={e => set({ ...data, description: e.target.value })} rows={2} className="admin-input p-3 text-sm resize-none" />
        </div>
        <div className="flex gap-3 pt-1">
            <button onClick={onSave} className="btn-admin-save px-5 py-2 text-sm rounded-xl flex items-center gap-2"><RiSaveLine size={13} />{saveLabel}</button>
            {onCancel && <button onClick={onCancel} className="btn-secondary px-5 py-2 text-sm rounded-xl">Cancel</button>}
        </div>
    </div>
);

export default function AdminCertificationsPage() {
    const [items, setItems] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [newItem, setNewItem] = useState<Omit<Certification, 'id'>>({ ...EMPTY });

    useEffect(() => { getCertifications().then(setItems).finally(() => setLoading(false)); }, []);

    const save = async (item: Certification) => {
        if (!item.id) return; setSaving(item.id);
        try { const { id, ...data } = item; await updateDocument('certifications', id, data); toast.success('Saved!'); }
        catch { toast.error('Save failed.'); } finally { setSaving(null); }
    };

    const add = async () => {
        try {
            const id = await addDocument('certifications', { ...newItem, order: items.length });
            setItems([...items, { ...newItem, id }]);
            setNewItem({ ...EMPTY }); setAdding(false); toast.success('Certification added!');
        } catch { toast.error('Failed.'); }
    };

    const remove = async (id: string) => {
        if (!confirm('Delete?')) return;
        try { await deleteDocument('certifications', id); setItems(items.filter(i => i.id !== id)); toast.success('Deleted.'); }
        catch { toast.error('Failed.'); }
    };

    if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">Certifications</h1>
                    <p className="text-text-muted text-sm mt-1">Manage your credentials and badges</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setAdding(true)} className="btn-admin-save px-5 py-2.5 text-sm rounded-xl flex items-center gap-2">
                    <RiAddLine size={14} />Add Certification
                </motion.button>
            </div>
            <AnimatePresence>
                {adding && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="glass rounded-2xl p-6 border border-violet/20 mb-5">
                        <h2 className="font-display font-semibold text-text-primary mb-4">New Certification</h2>
                        <Form data={newItem} set={setNewItem} onSave={add} saveLabel="Add" onCancel={() => setAdding(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="glass rounded-2xl border border-white/6 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4">
                            <h3 className="font-display font-semibold text-text-primary text-sm truncate flex-1">{item.name || 'Untitled'}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => setExpanded(expanded === item.id ? null : item.id!)}
                                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-text-secondary">
                                    {expanded === item.id ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
                                </button>
                                <button onClick={() => save(item)} disabled={saving === item.id}
                                    className="btn-admin-save px-3 py-1.5 text-xs rounded-xl flex items-center gap-1"><RiSaveLine size={10} />{saving === item.id ? '…' : 'Save'}</button>
                                <button onClick={() => remove(item.id!)}
                                    className="btn-admin-delete p-1.5 rounded-lg"><RiDeleteBinLine size={13} /></button>
                            </div>
                        </div>
                        <AnimatePresence>
                            {expanded === item.id && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                    <div className="px-6 pb-6 border-t border-white/5 pt-4">
                                        <Form data={item} set={(d: Certification) => setItems(items.map(i => i.id === item.id ? { ...d, id: item.id } : i))} onSave={() => save(item)} saveLabel="Save" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
                {items.length === 0 && <div className="glass rounded-2xl p-12 border border-white/6 text-center text-text-muted">No certifications yet.</div>}
            </div>
        </div>
    );
}
