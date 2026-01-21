"use client";

import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Loader from './components/Loader';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Featured from './components/Featured';
import VideoSection from './components/VideoSection';
import IngredientFinder from './components/IngredientFinder';
import { getFeaturedEvenMeals } from './services/mealdb';

export default function Home() {
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      try {
        const meals = await getFeaturedEvenMeals();
        if (isMounted) setFeaturedMeals(meals);
      } catch (error) {
        console.error('Error loading featured meals', error);
        if (isMounted) setFeaturedError('Unable to load featured recipes right now.');
      } finally {
        if (isMounted) setLoadingFeatured(false);
      }
    }

    loadFeatured();
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Featured Section */}
      <Featured 
        meals={featuredMeals} 
        loading={loadingFeatured} 
        error={featuredError}
      />

      {/* Video Section */}
      <VideoSection meals={featuredMeals} loading={loadingFeatured} />

      {/* Ingredient Finder Section */}
      <IngredientFinder />

      <Footer />
    </div>
  );
}
