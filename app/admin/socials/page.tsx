'use client';
import { useState, useEffect } from 'react';
import { getDocument, setDocument } from '@/lib/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { RiSaveLine, RiAddLine, RiDeleteBinLine } from 'react-icons/ri';
import {
    RiLinkedinFill, RiTwitterXFill, RiInstagramLine, RiGithubFill, RiGlobalLine,
    RiWhatsappLine, RiMediumLine, RiExternalLinkLine, RiMailLine,
} from 'react-icons/ri';

const PLATFORMS = [
    { key: 'linkedin', label: 'LinkedIn', icon: RiLinkedinFill, placeholder: 'https://linkedin.com/in/yourprofile' },
    { key: 'twitter', label: 'Twitter / X', icon: RiTwitterXFill, placeholder: 'https://twitter.com/yourhandle' },
    { key: 'whatsapp', label: 'WhatsApp', icon: RiWhatsappLine, placeholder: 'https://wa.me/91XXXXXXXXXX' },
    { key: 'medium', label: 'Medium', icon: RiMediumLine, placeholder: 'https://medium.com/@yourhandle' },
    { key: 'topmate', label: 'Topmate', icon: RiExternalLinkLine, placeholder: 'https://topmate.io/yourprofile' },
    { key: 'instagram', label: 'Instagram', icon: RiInstagramLine, placeholder: 'https://instagram.com/yourhandle' },
    { key: 'github', label: 'GitHub', icon: RiGithubFill, placeholder: 'https://github.com/yourusername' },
    { key: 'email', label: 'Email', icon: RiMailLine, placeholder: 'mailto:your@email.com' },
    { key: 'website', label: 'Personal Website', icon: RiGlobalLine, placeholder: 'https://yourwebsite.com' },
];

interface SocialsData {
    [key: string]: string;
}

export default function AdminSocialsPage() {
    const [data, setData] = useState<SocialsData>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [customLinks, setCustomLinks] = useState<{ label: string; url: string; id: string }[]>([]);

    useEffect(() => {
        getDocument<{ socials: SocialsData; customLinks: typeof customLinks }>('settings/socials')
            .then((d) => {
                if (d?.socials) setData(d.socials);
                if (d?.customLinks) setCustomLinks(d.customLinks);
            })
            .finally(() => setLoading(false));
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            await setDocument('settings/socials', { socials: data, customLinks });
            toast.success('Social links saved!');
        } catch { toast.error('Save failed. Check Firebase config.'); }
        finally { setSaving(false); }
    };

    const addCustom = () => setCustomLinks([...customLinks, { label: '', url: '', id: Date.now().toString() }]);
    const removeCustom = (id: string) => setCustomLinks(customLinks.filter(l => l.id !== id));
    const updateCustom = (id: string, field: 'label' | 'url', value: string) =>
        setCustomLinks(customLinks.map(l => l.id === id ? { ...l, [field]: value } : l));

    if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">Socials & Links</h1>
                    <p className="text-text-muted text-sm mt-1">Manage your social media profiles and custom links</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={save} disabled={saving}
                    className="btn-admin-save px-5 py-2.5 text-sm rounded-xl flex items-center gap-2">
                    <RiSaveLine size={14} />{saving ? 'Saving…' : 'Save Changes'}
                </motion.button>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/6 mb-5">
                <h2 className="font-display font-semibold text-text-primary mb-1">Social Profiles</h2>
                <p className="text-text-muted text-xs mb-5">Add your profile URLs — these will show across the public site.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                    {PLATFORMS.map(({ key, label, icon: Icon, placeholder }) => (
                        <div key={key} className="flex items-center gap-3">
                            <div className="w-10 h-10 glass border border-white/10 rounded-xl flex items-center justify-center text-text-secondary shrink-0">
                                <Icon size={16} />
                            </div>
                            <div className="flex-1">
                                <label className="text-text-secondary text-xs font-medium block mb-1">{label}</label>
                                <input
                                    type="text"
                                    placeholder={placeholder}
                                    value={data[key] || ''}
                                    onChange={e => setData({ ...data, [key]: e.target.value })}
                                    className="admin-input px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-display font-semibold text-text-primary">Custom Links</h2>
                        <p className="text-text-muted text-xs mt-0.5">Any extra links, e.g. your portfolio, resume, or project page.</p>
                    </div>
                    <button onClick={addCustom} className="flex items-center gap-1.5 text-violet-600 text-xs font-medium hover:text-white transition-colors">
                        <RiAddLine size={14} />Add Link
                    </button>
                </div>
                <div className="space-y-3">
                    {customLinks.map((link) => (
                        <div key={link.id} className="flex items-center gap-3">
                            <input placeholder="Label (e.g. Portfolio)" value={link.label} onChange={e => updateCustom(link.id, 'label', e.target.value)} className="admin-input px-3 py-2 text-sm w-40 shrink-0" />
                            <input placeholder="https://" value={link.url} onChange={e => updateCustom(link.id, 'url', e.target.value)} className="admin-input px-3 py-2 text-sm flex-1" type="text" />
                            <button onClick={() => removeCustom(link.id)} className="btn-admin-delete p-2 rounded-xl shrink-0">
                                <RiDeleteBinLine size={13} />
                            </button>
                        </div>
                    ))}
                    {customLinks.length === 0 && <p className="text-text-muted text-sm">No custom links yet.</p>}
                </div>
            </div>
        </div>
    );
}
