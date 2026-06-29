'use client';
import { useState, useEffect } from 'react';
import { getSiteConfig, setAbout, AboutData } from '@/lib/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { RiSaveLine, RiUploadLine, RiExternalLinkLine } from 'react-icons/ri';

const DEFAULT: AboutData = {
    name: 'Archit Chandrakar',
    headline: 'Product Manager | Builder | Storyteller',
    subHeadline: 'Turning complex problems into elegant products.',
    bio: 'I\'m a Product Manager with 5+ years of experience building digital products that people actually love.',
    photoUrl: '',
    location: 'India',
    email: 'archit@example.com',
    resumeUrl: '',
    socials: [],
};

const Field = ({ label, field, data, setData, type = 'text', rows }: { label: string; field: keyof AboutData; data: AboutData; setData: (d: AboutData) => void; type?: string; rows?: number }) => (
    <div>
        <label className="block text-text-secondary text-sm font-medium mb-1.5">{label}</label>
        {rows ? (
            <textarea
                value={(data[field] as string) || ''}
                onChange={(e) => setData({ ...data, [field]: e.target.value })}
                rows={rows}
                className="admin-input p-3 text-sm resize-none"
            />
        ) : (
            <input
                type={type}
                value={(data[field] as string) || ''}
                onChange={(e) => setData({ ...data, [field]: e.target.value })}
                className="admin-input px-3 py-2.5 text-sm"
            />
        )}
    </div>
);

const ResumeUpload = ({ resumeUrl, onUploaded }: { resumeUrl: string; onUploaded: (url: string) => void }) => {
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File must be under 10MB.');
            e.target.value = '';
            return;
        }
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            onUploaded(url);
            toast.success('Resume uploaded!');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Upload failed.');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div>
            <label className="block text-text-secondary text-sm font-medium mb-1.5">Resume / CV</label>
            <div className="flex items-center gap-3 flex-wrap">
                <label className="btn-secondary px-4 py-2.5 text-sm rounded-xl cursor-pointer flex items-center gap-2 w-fit">
                    <RiUploadLine size={14} />
                    {uploading ? 'Uploading…' : resumeUrl ? 'Replace File' : 'Upload File'}
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFile}
                        disabled={uploading}
                    />
                </label>
                {resumeUrl && (
                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-600 text-xs font-medium hover:underline flex items-center gap-1"
                    >
                        View current file <RiExternalLinkLine size={11} />
                    </a>
                )}
            </div>
        </div>
    );
};

export default function AdminAboutPage() {
    const [data, setData] = useState<AboutData>(DEFAULT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getSiteConfig().then((d) => { if (d) setData(d); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            await setAbout(data);
            toast.success('About section saved!');
        } catch {
            toast.error('Save failed. Check Firebase config.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">About & Hero</h1>
                    <p className="text-text-muted text-sm mt-1">Edit your personal information, bio, and hero section</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={save} disabled={saving}
                    className="btn-admin-save px-5 py-2.5 text-sm rounded-xl flex items-center gap-2">
                    <RiSaveLine size={14} />
                    {saving ? 'Saving…' : 'Save Changes'}
                </motion.button>
            </div>

            <div className="space-y-5">
                <div className="glass rounded-2xl p-6 border border-white/6">
                    <h2 className="font-display font-semibold text-text-primary mb-5">Basic Info</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Full Name" field="name" data={data} setData={setData} />
                        <Field label="Location" field="location" data={data} setData={setData} />
                        <Field label="Email" field="email" type="email" data={data} setData={setData} />
                        <ResumeUpload resumeUrl={data.resumeUrl} onUploaded={(url) => setData({ ...data, resumeUrl: url })} />
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border border-white/6">
                    <h2 className="font-display font-semibold text-text-primary mb-5">Hero Section</h2>
                    <div className="space-y-4">
                        <Field label="Headline (e.g. Product Manager | Builder)" field="headline" data={data} setData={setData} />
                        <Field label="Sub-headline (shown below typewriter)" field="subHeadline" data={data} setData={setData} />
                        <Field label="Profile Photo URL" field="photoUrl" type="url" data={data} setData={setData} />
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border border-white/6">
                    <h2 className="font-display font-semibold text-text-primary mb-5">Bio</h2>
                    <Field label="Bio (use double line breaks for paragraphs)" field="bio" rows={8} data={data} setData={setData} />
                </div>
            </div>
        </div>
    );
}
