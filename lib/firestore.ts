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

// ─── Agent Fact Pool ──────────────────────────────────────────────────────────
// The grounded source of truth the job-application agent is allowed to draw on.
// One doc = one atomic, checkable claim. The LLM selects and cites `factId`s
// rather than writing experience of its own, so nothing unverified reaches a
// resume or cold email.

export type FactCategory =
    | 'experience'
    | 'project'
    | 'skill'
    | 'education'
    | 'certification'
    | 'personal';

/** Which target-role narrative a fact supports. */
export type RoleTrack = 'technical-pm' | 'ai-pm' | 'both';

/**
 * How widely a fact may travel.
 *  - `public`         already on the portfolio / LinkedIn; safe anywhere.
 *  - `private`        NDA-ish, but fine in a resume or email to one employer.
 *  - `interview-only` never put in writing. Held for personal recall and
 *                     stripped from every export, so the agent cannot mail it.
 */
export type FactVisibility = 'public' | 'private' | 'interview-only';

export interface AgentFact {
    id?: string;
    /** Stable, human-readable citation key, e.g. "EXP-ATPM-03". */
    factId: string;
    category: FactCategory;
    /** The atomic claim, written as a resume-ready bullet. */
    statement: string;
    /** Where it happened — company, product, or project name. */
    context: string;
    /** Quantified outcome, if one exists. Kept separate so it can be verified. */
    metric: string;
    /** Skill tags used to match the fact against a JD. */
    skills: string[];
    tracks: RoleTrack[];
    /** 1–5 selection priority when the agent has to cut for length. */
    weight: number;
    /** Inactive facts are withheld from the agent entirely. */
    active: boolean;
    /** Confidentiality tier. Governs whether the fact reaches the agent at all. */
    visibility: FactVisibility;
    /**
     * Raw detail — real client names, exact figures — kept for your own
     * interview prep. Never exported and never sent to the agent under any
     * visibility tier. Keep `statement` itself sanitised.
     */
    privateNote?: string;
    /**
     * Provenance when seeded from existing portfolio content, e.g.
     * "experience:abc123#0". Used to avoid re-importing the same bullet twice.
     * Absent on hand-written facts.
     */
    source?: string;
    createdAt: string;
    updatedAt: string;
}

export const getAgentFacts = () =>
    getCollectionDocs<AgentFact>('agentFacts', orderBy('factId', 'asc'));

/** Only what the agent is cleared to use, shaped for the n8n prompt. */
export const getActiveAgentFacts = () =>
    getCollectionDocs<AgentFact>(
        'agentFacts',
        where('active', '==', true),
        orderBy('factId', 'asc')
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
    getCollectionDocs<ExperienceEntry>('experience', orderBy('order', 'desc'));

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