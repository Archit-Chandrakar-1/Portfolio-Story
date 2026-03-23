'use client';
import { useState, useEffect } from 'react';
import { getProjects, addDocument, updateDocument, deleteDocument, Product } from '@/lib/firestore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiDeleteBinLine, RiSaveLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

const EMPTY: Omit<Product, 'id'> = {
    name: '', description: '', longDescription: '',
    tags: [], link: '', prdUrl: '', imageUrl: '', featured: false, order: 0,
};

const TextField = ({ label, value, onChange, type = 'text', rows }: { label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number }) => (
    <div>
        <label className="text-text-secondary text-xs font-medium block mb-1">{label}</label>
        {rows ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className="admin-input p-3 text-sm resize-none" />
            : <input type={type} value={value} onChange={e => onChange(e.target.value)} className="admin-input px-3 py-2 text-sm" />}
    </div>
);

const ItemForm = ({ data, set, onSave, onCancel, saveLabel }: { data: Omit<Product, 'id'>; set: (d: Omit<Product, 'id'>) => void; onSave: () => void; onCancel: () => void; saveLabel: string }) => (
    <div className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
            <TextField label="Product Name" value={data.name} onChange={v => set({ ...data, name: v })} />
            <TextField label="Short Description" value={data.description} onChange={v => set({ ...data, description: v })} />
            <TextField label="Link / URL" value={data.link} onChange={v => set({ ...data, link: v })} type="url" />
            <TextField label="Image URL" value={data.imageUrl} onChange={v => set({ ...data, imageUrl: v })} type="url" />
            <TextField label="PRD URL (Optional)" value={data.prdUrl || ''} onChange={v => set({ ...data, prdUrl: v })} type="url" />
        </div>
        <TextField label="Long Description" value={data.longDescription} onChange={v => set({ ...data, longDescription: v })} rows={3} />
        <TextField label="Tags (comma separated)" value={(data.tags ?? []).join(', ')} onChange={v => set({ ...data, tags: v.split(',').map(t => t.trim()).filter(Boolean) })} />
        <label className="flex items-center gap-2 text-text-secondary text-sm cursor-pointer">
            <input type="checkbox" checked={data.featured} onChange={e => set({ ...data, featured: e.target.checked })} className="accent-violet" />
            Featured product
        </label>
        <div className="flex gap-3 pt-2">
            <button onClick={onSave} className="btn-admin-save px-5 py-2 text-sm rounded-xl flex items-center gap-2"><RiSaveLine size={13} />{saveLabel}</button>
            <button onClick={onCancel} className="btn-secondary px-5 py-2 text-sm rounded-xl">Cancel</button>
        </div>
    </div>
);

export default function AdminProductsPage() {
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [newItem, setNewItem] = useState<Omit<Product, 'id'>>({ ...EMPTY });

    useEffect(() => { getProjects().then(setItems).finally(() => setLoading(false)); }, []);

    const save = async (item: Product) => {
        if (!item.id) return;
        setSaving(item.id);
        try { const { id, ...data } = item; await updateDocument('projects', id, data); toast.success('Saved!'); }
        catch { toast.error('Save failed.'); }
        finally { setSaving(null); }
    };

    const add = async () => {
        try {
            const id = await addDocument('projects', { ...newItem, order: items.length });
            setItems([...items, { ...newItem, id }]);
            setNewItem({ ...EMPTY }); setAdding(false); toast.success('Product added!');
        } catch { toast.error('Failed.'); }
    };

    const remove = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        try { await deleteDocument('projects', id); setItems(items.filter(i => i.id !== id)); toast.success('Deleted.'); }
        catch { toast.error('Failed.'); }
    };

    const updateField = (id: string, field: keyof Product, value: unknown) =>
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));

    if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">Products</h1>
                    <p className="text-text-muted text-sm mt-1">Manage your portfolio products</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setAdding(true)} className="btn-admin-save px-5 py-2.5 text-sm rounded-xl flex items-center gap-2">
                    <RiAddLine size={14} />Add Product
                </motion.button>
            </div>

            <AnimatePresence>
                {adding && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="glass rounded-2xl p-6 border border-violet/20 mb-5">
                        <h2 className="font-display font-semibold text-text-primary mb-4">New Product</h2>
                        <ItemForm data={newItem} set={setNewItem} onSave={add} onCancel={() => setAdding(false)} saveLabel="Add" />
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
                                            data={item as Omit<Product, 'id'>}
                                            set={(d) => setItems(items.map(i => i.id === item.id ? { ...d, id: item.id } : i))}
                                            onSave={() => save(item)} onCancel={() => setExpanded(null)} saveLabel="Save"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
                {items.length === 0 && <div className="glass rounded-2xl p-12 border border-white/6 text-center text-text-muted">No products yet.</div>}
            </div>
        </div>
    );
}
