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
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    tags: string[];
    order: number;
}

export interface Product {
    id?: string;
    name: string;
    description: string;
    longDescription: string;
    tags: string[];
    link: string;
    prdUrl?: string;
    imageUrl: string;
    featured: boolean;
    order: number;
}

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

export const getServices = () =>
    getCollectionDocs<Service>(
        'services',
        orderBy('order', 'asc')
    );

// ─── Generic Helpers ──────────────────────────────────────────────────────────

export async function getDocument<T>(path: string): Promise<T | null> {
    try {
        const ref = doc(db, path);
        const snap = await getDoc(ref);
        return snap.exists() ? (snap.data() as T) : null;
    } catch (error) {
        console.warn(`[Firestore] getDocument failed for path ${path}:`, error);
        return null;
    }
}

export async function setDocument<T extends DocumentData>(path: string, data: T): Promise<void> {
    const ref = doc(db, path);
    await setDoc(ref, data, { merge: true });
}

export async function getCollectionDocs<T extends { id?: string }>(
    collectionPath: string,
    ...constraints: QueryConstraint[]
): Promise<T[]> {
    try {
        const ref = collection(db, collectionPath);
        const q = constraints.length ? query(ref, ...constraints) : query(ref);
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
    } catch (error) {
        console.warn(`[Firestore] getCollectionDocs failed for path ${collectionPath}:`, error);
        return [];
    }
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
