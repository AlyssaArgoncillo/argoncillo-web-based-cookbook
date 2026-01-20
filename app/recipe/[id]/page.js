"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import ContentWrapper from '../../components/ContentWrapper';
import Loader from '../../components/Loader';
import { getMealById } from '../../services/mealdb';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark' || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                      html.getAttribute('data-theme') !== 'light');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getMealById(id);
        if (data) {
          setMeal(data);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Loader />
        </div>
      </>
    );
  }

  if (error || !meal) {
    return (
      <>
        <Navigation />
        <ContentWrapper>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: isDarkMode ? '#6b7280' : '#374151', marginBottom: '20px' }}>
              {error || 'Recipe not found'}
            </p>
            <button
              onClick={() => router.back()}
              style={{
                padding: '10px 20px',
                backgroundColor: isDarkMode ? '#f59e0b' : '#ea580c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Go Back
            </button>
          </div>
        </ContentWrapper>
      </>
    );
  }

  const colors = isDarkMode ? {
    bg: '#163e57',
    textPrimary: '#fdf4e3',
    textSecondary: '#c9d6df',
    categoryBg: '#fbbf24',
    categoryText: '#78350f',
    areaBg: '#f59e0b',
    areaText: '#ffffff',
    tagBg: '#fed7aa',
    tagText: '#92400e',
    linedBg: '#163e57',
    borderColor: 'rgba(234, 179, 8, 0.3)'
  } : {
    bg: '#fefbf8',
    textPrimary: '#7c2d12',
    textSecondary: '#92400e',
    categoryBg: '#fb923c',
    categoryText: '#7c2d12',
    areaBg: '#ea580c',
    areaText: '#ffffff',
    tagBg: '#fee2c3',
    tagText: '#7c2d12',
    linedBg: '#fefbf8',
    borderColor: 'rgba(217, 119, 6, 0.3)'
  };

  // Extract ingredients and measurements
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        measure: measure || ''
      });
    }
  }

  // Extract YouTube video ID if available
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(meal.strYoutube);

  return (
    <>
      <Navigation />
      <div style={{
        backgroundColor: isDarkMode ? '#163e57' : '#fefbf8',
        backgroundImage: isDarkMode 
          ? 'linear-gradient(#163e57 1.1rem, #0f2f44 1.2rem)'
          : 'linear-gradient(#ffffff 1.1rem, #e5e7eb 1.2rem)',
        backgroundSize: '100% 1.2rem',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, background-image 0.3s ease'
      }}>
        <ContentWrapper maxWidth="1000px" padding="40px 20px" backgroundColor="transparent">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: colors.textPrimary,
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '24px',
            padding: '0',
            textDecoration: 'none'
          }}
        >
          <span style={{ fontSize: '20px' }}>←</span>
          Back
        </button>

        {/* Title and Tags */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: '16px',
            fontFamily: 'var(--font-playfair-display)',
            lineHeight: '1.2'
          }}>
            {meal.strMeal}
          </h1>

          {/* Tags */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '16px'
          }}>
            {meal.strCategory && (
              <span style={{
                display: 'inline-block',
                backgroundColor: colors.categoryBg,
                color: colors.categoryText,
                padding: '8px 14px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {meal.strCategory}
              </span>
            )}
            {meal.strArea && (
              <span style={{
                display: 'inline-block',
                backgroundColor: colors.areaBg,
                color: colors.areaText,
                padding: '8px 14px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {meal.strArea}
              </span>
            )}
            {meal.strTags && meal.strTags.split(',').map((tag, index) => (
              <span key={index} style={{
                display: 'inline-block',
                backgroundColor: colors.tagBg,
                color: colors.tagText,
                padding: '8px 14px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {tag.trim()}
              </span>
            ))}
          </div>

          {/* Source Link */}
          {meal.strSource && (
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: `2px dashed ${colors.borderColor}`
            }}>
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: colors.areaBg,
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                View Original Recipe
                <span>↗</span>
              </a>
            </div>
          )}
        </div>

        {/* Main Content - Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginBottom: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column - Image */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Recipe Image */}
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              aspectRatio: '1'
            }}>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          {/* Right Column - Ingredients Card */}
          <div style={{
            backgroundColor: isDarkMode ? '#fef3c7' : '#fed7aa',
            borderRadius: '2px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
            border: '1px solid rgba(217, 119, 6, 0.1)',
            transform: `rotate(${Math.random() * 4 - 2}deg)`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            height: 'fit-content'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: isDarkMode ? '#78350f' : '#7c2d12',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Ingredients
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {ingredients.map((ingredient, index) => (
                <li key={index} style={{
                  color: isDarkMode ? '#92400e' : '#92400e',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  paddingLeft: '20px',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: isDarkMode ? '#f59e0b' : '#ea580c',
                    fontWeight: '700'
                  }}>•</span>
                  <span style={{ fontWeight: '600' }}>{ingredient.measure}</span> {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions Section */}
        <div style={{
          backgroundColor: isDarkMode ? '#fef3c7' : '#fed7aa',
          borderRadius: '2px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
          border: '1px solid rgba(217, 119, 6, 0.1)',
          transform: `rotate(${Math.random() * 4 - 2}deg)`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: isDarkMode ? '#78350f' : '#7c2d12',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Instructions
          </h3>
          <div style={{
            color: isDarkMode ? '#92400e' : '#92400e',
            fontSize: '15px',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {meal.strInstructions}
          </div>
        </div>

        {/* Video Section - Full Width Below Instructions */}
        {youtubeId && (
          <div style={{
            marginBottom: '40px'
          }}>
            <div style={{
              aspectRatio: '16/9',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              backgroundColor: '#000000',
              maxWidth: '100%'
            }}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={`${meal.strMeal} Video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: '8px' }}
              />
            </div>
          </div>
        )}

        {/* No Video Disclaimer */}
        {!youtubeId && (
          <div style={{
            backgroundColor: isDarkMode ? '#fef3c7' : '#fed7aa',
            borderRadius: '2px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
            border: '1px solid rgba(217, 119, 6, 0.1)',
            textAlign: 'center',
            transform: `rotate(${Math.random() * 4 - 2}deg)`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <p style={{
              color: isDarkMode ? '#92400e' : '#92400e',
              fontSize: '16px',
              margin: '0',
              fontStyle: 'italic'
            }}>
              📹 No video available for this recipe
            </p>
          </div>
        )}

        </ContentWrapper>
      </div>
    </>
  );
}
