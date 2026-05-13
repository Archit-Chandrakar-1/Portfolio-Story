import WorkflowsSection from '@/components/sections/WorkflowsSection';
import { getWorkflows } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Workflows | Portfolio',
    description: 'Workflows and pipelines I have built.',
};

export default async function WorkflowsPage() {
    const workflows = await getWorkflows();

    return (
        <main className="min-h-screen pt-24 bg-bg">
            <WorkflowsSection workflows={workflows} />
        </main>
    );
}
