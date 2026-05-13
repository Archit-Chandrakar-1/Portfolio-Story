import { getAllClients } from '@/lib/firestore';
import ClientsSection from '@/components/sections/ClientsSection';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Clients — Archit Chandrakar',
    description: 'Freelancing clients and projects I have worked with.',
};

export default async function ClientsPage() {
    const allClients = await getAllClients();
    const clients = allClients.filter(c => c.published);
    return (
        <main className="min-h-screen bg-bg pt-32 pb-20">
            <ClientsSection clients={clients} />
        </main>
    );
}