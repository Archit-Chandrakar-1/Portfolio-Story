import { db } from './firebase-client';
import { where } from 'firebase/firestore';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    DocumentData,
    QueryConstraint,
} from 'firebase/firestore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SocialLink {
    platform: string;
    url: string;
    icon: string;
}

export interface AboutData {
    name: string;
    headline: string;
    subHeadline: string;
    bio: string;
    photoUrl: string;
    location: string;
    email: string;
    resumeUrl: string;
    socials: SocialLink[];
}

export interface ExperienceEntry {
    id?: string;
    title: string;
    company: string;
    companyLogo?: string;
    companyWebsite?: string;
    companyLinkedIn?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    tags: string[];
    order: number;
}

// ─── Case Study Types ─────────────────────────────────────────────────────────

export interface CaseStudySection {
    heading: string;
    body: string;
    imageUrl?: string;
}

export interface CaseStudyMetric {
    label: string;
    before: string;
    after: string;
}

export interface CaseStudy {
    problem: CaseStudySection;
    research: CaseStudySection;
    solution: CaseStudySection;
    learnings: CaseStudySection;
    metrics: CaseStudyMetric[];
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
    id?: string;
    name: string;
    description: string;
    longDescription: string;
    tags: string[];
    link: string;
    slug?: string;
    prdUrl?: string;
    imageUrl: string;
    featured: boolean;
    order: number;
    caseStudy?: CaseStudy;
}

// ─── Other Types ──────────────────────────────────────────────────────────────

export interface Certification {
    id?: string;
    name: string;
    issuer: string;
    issuerLogo?: string;
    date: string;
    credentialUrl: string;
    badgeUrl: string;
    description: string;
    order: number;
}

export interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    tags: string[];
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Service {
    id?: string;
    title: string;
    description: string;
    order: number;
    isActive: boolean;
}

export type WorkflowTag = 'AI' | 'Automation' | 'Analytics' | 'Research' | 'GTM';

export interface WorkflowNode {
    icon: string;
    label: string;
    tool: string;
}

export interface WorkflowCaseStudySection {
    heading: string;
    body: string;
}

export interface WorkflowCaseStudy {
    why: WorkflowCaseStudySection;
    how: WorkflowCaseStudySection;
    results: WorkflowCaseStudySection;
}

export interface Workflow {
    id?: string;
    title: string;
    description: string;
    problem: string;
    outcome: string;
    tags: WorkflowTag[];
    imageUrl?: string;
    tool: string;
    impact: string;
    nodes: WorkflowNode[];
    liveLink?: string;
    githubLink?: string;
    notionLink?: string;
    order?: number;
    caseStudy?: WorkflowCaseStudy;
}

export interface Client {
    id?: string;
    name: string;
    description: string;
    website: string;       // full URL e.g. https://myclient.com
    logoUrl?: string;      // Firebase Storage URL
    tags: string[];        // e.g. ["SaaS", "Fintech"]
    order: number;
    published: boolean;
}

export const getClients = () =>
    getCollectionDocs<Client>(
        'clients',
        where('published', '==', true),
        orderBy('order', 'asc')
    );


// ─── Generic Helpers ──────────────────────────────────────────────────────────

export async function getDocument<T>(path: string): Promise<T | null> {
    const ref = doc(db, path);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as T) : null;
}

export async function setDocument<T extends DocumentData>(path: string, data: T): Promise<void> {
    const ref = doc(db, path);
    await setDoc(ref, data, { merge: true });
}

export async function getCollectionDocs<T extends { id?: string }>(
    collectionPath: string,
    ...constraints: QueryConstraint[]
): Promise<T[]> {
    const ref = collection(db, collectionPath);
    const q = constraints.length ? query(ref, ...constraints) : query(ref);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

export async function addDocument<T extends DocumentData>(
    collectionPath: string,
    data: T
): Promise<string> {
    const ref = collection(db, collectionPath);
    const added = await addDoc(ref, data);
    return added.id;
}

export async function updateDocument<T extends DocumentData>(
    collectionPath: string,
    id: string,
    data: Partial<T>
): Promise<void> {
    const ref = doc(db, collectionPath, id);
    await updateDoc(ref, data as DocumentData);
}

export async function deleteDocument(collectionPath: string, id: string): Promise<void> {
    const ref = doc(db, collectionPath, id);
    await deleteDoc(ref);
}

// ─── Specific Helpers ─────────────────────────────────────────────────────────

export const getSiteConfig = () =>
    getDocument<AboutData>('siteConfig/main');

export const setAbout = (data: AboutData) => setDocument('siteConfig/main', data);

export const getExperiences = () =>
    getCollectionDocs<ExperienceEntry>('experience', orderBy('order', 'asc'));

export const getProjects = () =>
    getCollectionDocs<Product>('projects', orderBy('order', 'asc'));

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    const all = await getCollectionDocs<Product>('projects', where('slug', '==', slug));
    return all[0] ?? null;
};

export const getCertifications = () =>
    getCollectionDocs<Certification>('certifications', orderBy('order', 'asc'));

export const getBlogs = () =>
    getCollectionDocs<BlogPost>('blogs', orderBy('createdAt', 'desc'));

export const getPublishedBlogs = () =>
    getCollectionDocs<BlogPost>(
        'blogs',
        where('published', '==', true),
        orderBy('createdAt', 'desc')
    );

export const getServices = () =>
    getCollectionDocs<Service>('services', orderBy('order', 'asc'));

export const getWorkflows = () =>
    getCollectionDocs<Workflow>('workflows', orderBy('order', 'asc'));

export const getAllClients = () =>
    getCollectionDocs<Client>('clients', orderBy('order', 'asc'));