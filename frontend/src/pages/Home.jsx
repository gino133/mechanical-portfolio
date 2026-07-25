import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import HeroSection from '../components/home/HeroSection';
import IntroSection from '../components/home/IntroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import FeaturedProjects from '../components/home/FeaturedProjects';
import FeaturedBlog from '../components/home/FeaturedBlog';

const SECTION_COMPONENTS = {
    hero: HeroSection,
    intro: IntroSection,
    products: FeaturedProducts,
    projects: FeaturedProjects,
    blog: FeaturedBlog
};

const DEFAULT_SECTIONS = [
    { key: 'hero', enabled: true, order: 1 },
    { key: 'intro', enabled: true, order: 2 },
    { key: 'products', enabled: true, order: 3 },
    { key: 'projects', enabled: true, order: 4 },
    { key: 'blog', enabled: false, order: 5 }
];

const Home = () => {
    const { settings } = useSettings();
    const sections = settings.homeSections && settings.homeSections.length > 0
        ? settings.homeSections
        : DEFAULT_SECTIONS;

    const ordered = [...sections]
        .filter((s) => s.enabled)
        .sort((a, b) => a.order - b.order);

    return (
        <>
            {ordered.map((section) => {
                const Component = SECTION_COMPONENTS[section.key];
                if (!Component) return null;
                return <Component key={section.key} />;
            })}
        </>
    );
};

export default Home;
