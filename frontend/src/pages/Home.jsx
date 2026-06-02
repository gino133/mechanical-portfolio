import React from 'react';
import HeroSection from '../components/home/HeroSection';
import IntroSection from '../components/home/IntroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import FeaturedProjects from '../components/home/FeaturedProjects';

const Home = () => {
    return (
        <>
            <HeroSection />
            <IntroSection />
            <FeaturedProducts />
            <FeaturedProjects />
        </>
    );
};

export default Home;