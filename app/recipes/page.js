"use client";

import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import RecipeCard from '../components/RecipeCard';
import ContentWrapper from '../components/ContentWrapper';
import Loader from '../components/Loader';
import Search from '../components/Search';
import { getRandomMeal, getMealsByCategory, getMealsByArea, getMealsByIngredient, getMealById, searchMealsByName, mealHasIngredient } from '../services/mealdb';
import Footer from '../components/Footer';

const ITEMS_PER_PAGE = 15;

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ category: '', area: '', ingredient: '' });
  const [searchTerm, setSearchTerm] = useState('');
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

  const fetchInitialRecipes = async (category = '', area = '', ingredient = '', search = '') => {
    try {
      setLoading(true);
      setRecipes([]);
      setError('');
      
      let allMeals = [];
      
      // Helper function to fetch and get full details for meals
      const fetchDetailedMeals = async (meals, limit = 50) => {
        const detailedMeals = await Promise.allSettled(
          meals.slice(0, limit).map(meal => getMealById(meal.idMeal))
        );
        return detailedMeals
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => result.value);
      };
      
      // Fetch based on search term first
      if (search) {
        // Check if search contains multiple ingredients (comma-separated)
        const searchTerms = search.split(',').map(term => term.trim().toLowerCase()).filter(term => term.length > 0);
        
        if (searchTerms.length > 1) {
          // Multiple ingredients - use AND logic
          // Fetch meals for the first ingredient
          const firstIngredientMeals = await getMealsByIngredient(searchTerms[0]);
          
          if (firstIngredientMeals && firstIngredientMeals.length > 0) {
            // Fetch full details for all meals
            const detailedMeals = await fetchDetailedMeals(firstIngredientMeals, 100);
            
            // Filter meals that contain ALL search terms
            allMeals = detailedMeals.filter(meal => {
              return searchTerms.every(term => {
                // Check if meal name contains the term
                if (meal.strMeal && meal.strMeal.toLowerCase().includes(term)) {
                  return true;
                }
                // Check if any ingredient contains the term
                for (let i = 1; i <= 20; i++) {
                  const mealIngredient = meal[`strIngredient${i}`];
                  if (mealIngredient && mealIngredient.toLowerCase().includes(term)) {
                    return true;
                  }
                }
                return false;
              });
            });
          } else {
            allMeals = [];
          }
        } else {
          // Single search term - use regular name search
          allMeals = await searchMealsByName(search);
        }
      }
      // If category is selected, filter by category
      else if (category) {
        const categoryMeals = await getMealsByCategory(category);
        allMeals = await fetchDetailedMeals(categoryMeals);
      }
      // If area is selected, filter by area
      else if (area) {
        const areaMeals = await getMealsByArea(area);
        allMeals = await fetchDetailedMeals(areaMeals);
      }
      // If ingredient is selected, filter by ingredient
      else if (ingredient) {
        const ingredientMeals = await getMealsByIngredient(ingredient);
        allMeals = await fetchDetailedMeals(ingredientMeals);
      }
      // Default: fetch random meals
      else {
        const uniqueRecipes = new Map();
        
        // Keep fetching until we have ITEMS_PER_PAGE unique recipes
        while (uniqueRecipes.size < ITEMS_PER_PAGE) {
          const batchSize = ITEMS_PER_PAGE - uniqueRecipes.size;
          const meals = await Promise.all(
            Array(batchSize)
              .fill(null)
              .map(() => getRandomMeal())
          );
          
          meals.forEach(meal => {
            if (meal && !uniqueRecipes.has(meal.idMeal)) {
              uniqueRecipes.set(meal.idMeal, meal);
            }
          });
        }
        
        allMeals = Array.from(uniqueRecipes.values());
      }
      
      // Apply secondary filters for cross-filtering
      // When multiple filters are selected, ALL must match
      if (allMeals.length > 0) {
        // Build filter conditions based on what's selected
        const filters = [];
        
        if (category) {
          filters.push(meal => meal.strCategory === category);
        }
        if (area) {
          filters.push(meal => meal.strArea === area);
        }
        if (ingredient) {
          filters.push(meal => mealHasIngredient(meal, ingredient));
        }
        
        // Apply all filters - meal must pass ALL filter conditions
        if (filters.length > 1) {
          allMeals = allMeals.filter(meal => 
            filters.every(filterFn => filterFn(meal))
          );
        }
      }
      
      // Remove duplicates
      const uniqueMeals = Array.from(new Map(allMeals.map(meal => [meal.idMeal, meal])).values());
      
      setRecipes(uniqueMeals.slice(0, ITEMS_PER_PAGE));
      // If we have at least a full page, allow loading more
      setHasMore(uniqueMeals.length >= ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Unable to load recipes. Please try again.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreRecipes = async () => {
    try {
      setLoadingMore(true);
      const meals = await Promise.all(
        Array(ITEMS_PER_PAGE)
          .fill(null)
          .map(() => getRandomMeal())
      );
      const validMeals = meals.filter(meal => meal !== null);
      setRecipes(prev => {
        const combined = [...prev, ...validMeals];
        const uniqueMeals = Array.from(new Map(combined.map(meal => [meal.idMeal, meal])).values());
        return uniqueMeals;
      });
      setHasMore(validMeals.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Error loading more recipes:', err);
      setError('Unable to load more recipes. Please try again.');
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // Load initial recipes on mount only
    fetchInitialRecipes();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Only fetch when explicitly triggered, not on every keystroke
    fetchInitialRecipes(filters.category, filters.area, filters.ingredient, term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Only fetch when explicitly triggered (button click or Enter)
    fetchInitialRecipes(newFilters.category, newFilters.area, newFilters.ingredient, searchTerm);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', position: 'relative' }}>
      <style jsx>{`
        @keyframes floatRotate {
          0%, 100% {
            transform: translateY(0px) rotate(-5deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }
      `}</style>
      {/* Coffee Doodle - Upper Right */}
      <img
        src={isDarkMode ? '/CoffeeDoddle_dark.svg' : '/CoffeeDoddle.svg'}
        alt="Coffee decoration"
        style={{
          position: 'absolute',
          top: '120px',
          right: '20px',
          width: '360px',
          height: 'auto',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatRotate 3s ease-in-out infinite'
        }}
      />
      
      {/* Ice Cream Doodle - Lower Left */}
      <img
        src={isDarkMode ? '/IceCreamDoodle_dark.svg' : '/IceCreamDoodle.svg'}
        alt="Ice cream decoration"
        style={{
          position: 'absolute',
          bottom: '520px',
          left: '20px',
          width: '360px',
          height: 'auto',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatRotate 3s ease-in-out infinite'
        }}
      />
      

      <Navigation />

      {/* Page Header */}
      <ContentWrapper
        maxWidth="1100px"
        padding="56px 16px 24px"
        backgroundColor="transparent"
        minHeight="auto"
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          fontSize: '32px',
          marginBottom: '0.75rem',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-playfair-display)'
        }}>
          Explore Recipes
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          Discover delicious recipes from around the world
        </p>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <Search 
            placeholder="Search recipes..." 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
        </div>
      </ContentWrapper>

      {/* Content Section */}
      <ContentWrapper
        maxWidth="1100px"
        padding="24px 16px 56px"
        backgroundColor="transparent"
        minHeight="auto"
      >
        {error && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--badge-bg)',
            color: 'var(--text-secondary)',
            padding: '12px 14px',
            borderRadius: '10px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Recipes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {loading ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <div key={index} style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                padding: '1.5rem',
                minHeight: '280px',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Loader />
              </div>
            ))
          ) : (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} meal={recipe} />
            ))
          )}
        </div>

        {/* Load More Button */}
        {!loading && hasMore && (
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={fetchMoreRecipes}
              disabled={loadingMore}
              style={{
                backgroundColor: 'var(--btn-primary)',
                color: '#ffffff',
                padding: '12px 32px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loadingMore ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease',
                opacity: loadingMore ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => !loadingMore && (e.target.style.backgroundColor = 'var(--btn-primary-hover)')}
              onMouseOut={(e) => !loadingMore && (e.target.style.backgroundColor = 'var(--btn-primary)')}
            >
              {loadingMore ? <><Loader /></> : 'Load More Recipes'}
            </button>
          </div>
        )}

        {!loading && !hasMore && recipes.length > 0 && (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            padding: '24px'
          }}>
            <p>No more recipes to load</p>
          </div>
        )}

        {!loading && recipes.length === 0 && !error && (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            padding: '56px 24px'
          }}>
            <p>No recipes found</p>
          </div>
        )}
      </ContentWrapper>

      <Footer />
    </div>
  );
}
