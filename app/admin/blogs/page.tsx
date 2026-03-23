'use client';
import { useState, useEffect } from 'react';
import { getBlogs, addDocument, updateDocument, deleteDocument, BlogPost } from '@/lib/firestore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiDeleteBinLine, RiSaveLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { v4 as uuidv4 } from 'uuid';

const EMPTY: Omit<BlogPost, 'id'> = {
    title: '', slug: '', excerpt: '', content: '', coverImage: '',
    tags: [], published: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const PostForm = ({ data, set, onSave, saveLabel, onCancel }: any) => (
    <div className="space-y-3 mt-4">
        <div className="grid sm:grid-cols-2 gap-3">
            <div>
                <label className="text-text-secondary text-xs font-medium block mb-1">Title</label>
                <input value={data.title} onChange={e => set({ ...data, title: e.target.value, slug: slugify(e.target.value) })} className="admin-input px-3 py-2 text-sm" />
            </div>
            <div>
                <label className="text-text-secondary text-xs font-medium block mb-1">Slug (auto-generated)</label>
                <input value={data.slug} onChange={e => set({ ...data, slug: e.target.value })} className="admin-input px-3 py-2 text-sm" />
            </div>
            <div>
                <label className="text-text-secondary text-xs font-medium block mb-1">Cover Image URL</label>
                <input value={data.coverImage} onChange={e => set({ ...data, coverImage: e.target.value })} className="admin-input px-3 py-2 text-sm" />
            </div>
            <div>
                <label className="text-text-secondary text-xs font-medium block mb-1">Tags (comma separated)</label>
                <input value={data.tags.join(', ')} onChange={e => set({ ...data, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })} className="admin-input px-3 py-2 text-sm" />
            </div>
        </div>
        <div>
            <label className="text-text-secondary text-xs font-medium block mb-1">Excerpt</label>
            <textarea value={data.excerpt} onChange={e => set({ ...data, excerpt: e.target.value })} rows={2} className="admin-input p-3 text-sm resize-none" />
        </div>
        <div>
            <label className="text-text-secondary text-xs font-medium block mb-1">Content (Markdown supported)</label>
            <textarea value={data.content} onChange={e => set({ ...data, content: e.target.value })} rows={10} className="admin-input p-3 text-sm resize-none font-mono text-xs" placeholder="## Your heading&#10;&#10;Write your content here..." />
        </div>
        <label className="flex items-center gap-2 text-text-secondary text-sm cursor-pointer">
            <input type="checkbox" checked={data.published} onChange={e => set({ ...data, published: e.target.checked })} className="accent-violet" />
            Published (visible on site)
        </label>
        <div className="flex gap-3 pt-1">
            <button onClick={onSave} className="btn-admin-save px-5 py-2 text-sm rounded-xl flex items-center gap-2"><RiSaveLine size={13} />{saveLabel}</button>
            {onCancel && <button onClick={onCancel} className="btn-secondary px-5 py-2 text-sm rounded-xl">Cancel</button>}
        </div>
    </div>
);

export default function AdminBlogsPage() {
    const [items, setItems] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [newItem, setNewItem] = useState<Omit<BlogPost, 'id'>>({ ...EMPTY });

    useEffect(() => { getBlogs().then(setItems).finally(() => setLoading(false)); }, []);

    const save = async (item: BlogPost) => {
        if (!item.id) return; setSaving(item.id);
        try { const { id, ...d } = item; await updateDocument('blogs', id, { ...d, updatedAt: new Date().toISOString() }); toast.success('Post saved!'); }
        catch { toast.error('Save failed.'); } finally { setSaving(null); }
    };

    const add = async () => {
        const slug = newItem.slug || slugify(newItem.title);
        const data = { ...newItem, slug, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        try {
            const id = await addDocument('blogs', data);
            setItems([{ ...data, id }, ...items]);
            setNewItem({ ...EMPTY }); setAdding(false); toast.success('Post created!');
        } catch { toast.error('Failed.'); }
    };

    const remove = async (id: string) => {
        if (!confirm('Delete this post?')) return;
        try { await deleteDocument('blogs', id); setItems(items.filter(i => i.id !== id)); toast.success('Deleted.'); }
        catch { toast.error('Failed.'); }
    };

    const up = (id: string, field: keyof BlogPost, value: unknown) =>
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));

    if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">Blog Posts</h1>
                    <p className="text-text-muted text-sm mt-1">Write and manage your product insights</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setAdding(true)} className="btn-admin-save px-5 py-2.5 text-sm rounded-xl flex items-center gap-2">
                    <RiAddLine size={14} />New Post
                </motion.button>
            </div>

            <AnimatePresence>
                {adding && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="glass rounded-2xl p-6 border border-violet/20 mb-5">
                        <h2 className="font-display font-semibold text-text-primary">New Blog Post</h2>
                        <PostForm data={newItem} set={setNewItem} onSave={add} saveLabel="Publish" onCancel={() => setAdding(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="glass rounded-2xl border border-white/6 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className={`shrink-0 w-2 h-2 rounded-full ${item.published ? 'bg-cyan' : 'bg-text-muted'}`} />
                                <div className="min-w-0">
                                    <p className="font-display font-semibold text-text-primary text-sm truncate">{item.title || 'Untitled'}</p>
                                    <p className="text-text-muted text-xs">/{item.slug}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-xs px-2 py-0.5 rounded-lg border ${item.published ? 'bg-cyan/10 text-cyan-light border-cyan/20' : 'bg-white/5 text-text-muted border-white/10'}`}>
                                    {item.published ? 'Published' : 'Draft'}
                                </span>
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
                                        <PostForm
                                            data={item}
                                            set={(d: BlogPost) => setItems(items.map(i => i.id === item.id ? { ...d, id: item.id } : i))}
                                            onSave={() => save(item)} saveLabel="Save"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
                {items.length === 0 && <div className="glass rounded-2xl p-12 border border-white/6 text-center text-text-muted">No blog posts yet. Write your first one!</div>}
            </div>
        </div>
    );
}
