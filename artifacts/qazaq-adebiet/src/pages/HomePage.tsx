import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedAuthorsSection from '@/components/home/FeaturedAuthorsSection';
import RecentMaterialsSection from '@/components/home/RecentMaterialsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <CategoriesSection />
        <FeaturedAuthorsSection />
        <RecentMaterialsSection />
      </main>
      <Footer />
    </div>
  );
}
