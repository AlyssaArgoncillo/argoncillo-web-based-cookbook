"use client";

import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import RecipeCard from './components/RecipeCard';
import ContentWrapper from './components/ContentWrapper';
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
      <section className="hero-section">
        <ContentWrapper
          className="container"
          maxWidth="960px"
          padding="56px 16px"
          backgroundColor="transparent"
          minHeight="auto"
          style={{ textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: '32px',
            marginBottom: '1.25rem',
            color: 'var(--text-primary)'
          }}>
            Welcome to Dishly!
          </h1>
          <p style={{
            fontSize: '18px',
            maxWidth: '640px',
            margin: '0 auto 1.75rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.7'
          }}>
            Discover, create, and share delicious recipes from around the world. Your personal cookbook awaits.
          </p>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '320px',
            margin: '0 auto'
          }}>
            <button style={{
              backgroundColor: 'var(--btn-primary)',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--btn-primary-hover)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--btn-primary)'}
            >
              Explore Recipes
            </button>
          </div>
        </ContentWrapper>
      </section>

      {/* Featured Section */}
      <section style={{
        padding: '24px 16px 56px',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
          marginBottom: '1.25rem'
        }}>
          <div>
            <p style={{
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Editor&apos;s picks
            </p>
            <h2 style={{
              fontSize: '26px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-playfair-display)',
              margin: 0
            }}>
              Featured Recipes
            </h2>
          </div>
        </div>

        {featuredError && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--badge-bg)',
            color: 'var(--text-secondary)',
            padding: '12px 14px',
            borderRadius: '10px'
          }}>
            {featuredError}
          </div>
        )}

        {!featuredError && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {loadingFeatured ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  minHeight: '260px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  Loading...
                </div>
              ))
            ) : (
              featuredMeals.map((meal) => (
                <RecipeCard key={meal.idMeal} meal={meal} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
