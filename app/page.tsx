import Hero from '@/components/sections/Hero';
import LandingAbout from '@/components/sections/LandingAbout';
import StorySection from '@/components/sections/StorySection';
import Experience from '@/components/sections/Experience';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import FeaturedCertifications from '@/components/sections/FeaturedCertifications';
import { getSiteConfig, getExperiences, getProjects, getCertifications } from '@/lib/firestore';

export const revalidate = 60;

export default async function HomePage() {
    const [about, experiences, products, certs] = await Promise.allSettled([
        getSiteConfig(),
        getExperiences(),
        getProjects(),
        getCertifications(),
    ]);

    const aboutData = about.status === 'fulfilled' ? about.value : null;
    const experiencesData = experiences.status === 'fulfilled' ? experiences.value : [];
    if (experiences.status === 'rejected') console.error('Experiences Error:', experiences.reason);
    
    const productsData = products.status === 'fulfilled' ? (products.value ?? []) : [];
    if (products.status === 'rejected') console.error('Products Error:', products.reason);
    
    console.log(`Server Render: Experiences=${experiencesData.length}, Products=${productsData.length}`);
    
    const certsData = certs.status === 'fulfilled' ? (certs.value ?? []) : [];
    if (certs.status === 'rejected') console.error('Certs Error:', certs.reason);

    const displayProducts = productsData;
    const displayCerts = certsData;

    return (
        <>
            <Hero about={aboutData} />
            <LandingAbout />
            <Experience experiences={experiencesData} />
            <FeaturedProducts products={displayProducts} />
            <FeaturedCertifications certs={displayCerts} />
            <StorySection />
            {/* <Experience experiences={experiencesData} />
            <FeaturedProducts products={displayProducts} />
            <FeaturedCertifications certs={displayCerts} /> */}
        </>
    );
}
