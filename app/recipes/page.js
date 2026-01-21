"use client";

import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import RecipeCard from '../components/RecipeCard';
import ContentWrapper from '../components/ContentWrapper';
import Loader from '../components/Loader';
import Search from '../components/Search';
import { getRandomMeal, getMealsByCategory, getMealsByArea, getMealsByIngredient, getMealById, searchMealsByName } from '../services/mealdb';
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

  const fetchInitialRecipes = async (category = '', area = '', ingredient = '', search = '') => {
    try {
      setLoading(true);
      setRecipes([]);
      setError('');
      
      let allMeals = [];
      
      // Fetch based on search term first
      if (search) {
        allMeals = await searchMealsByName(search);
      }
      // If category is selected, filter by category
      else if (category) {
        const categoryMeals = await getMealsByCategory(category);
        // Get full details for each meal using settled to avoid failing the batch
        const detailedMeals = await Promise.allSettled(
          categoryMeals.slice(0, 50).map(meal => getMealById(meal.idMeal))
        );
        allMeals = detailedMeals
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => result.value);
      }
      // If area is selected, filter by area
      else if (area) {
        const areaMeals = await getMealsByArea(area);
        // Get full details for each meal using settled to avoid failing the batch
        const detailedMeals = await Promise.allSettled(
          areaMeals.slice(0, 50).map(meal => getMealById(meal.idMeal))
        );
        allMeals = detailedMeals
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => result.value);
      }
      // If ingredient is selected, filter by ingredient
      else if (ingredient) {
        const ingredientMeals = await getMealsByIngredient(ingredient);
        // Get full details for each meal using settled to avoid failing the batch
        const detailedMeals = await Promise.allSettled(
          ingredientMeals.slice(0, 50).map(meal => getMealById(meal.idMeal))
        );
        allMeals = detailedMeals
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => result.value);
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
          // Check if ingredient appears in any of the ingredient fields
          filters.push(meal => {
            // Get all ingredients from the meal
            const ingredientsList = [];
            for (let i = 1; i <= 20; i++) {
              const ing = meal[`strIngredient${i}`];
              if (ing && ing.trim()) {
                ingredientsList.push(ing.toLowerCase());
              }
            }
            return ingredientsList.some(ing => ing.includes(ingredient.toLowerCase()));
          });
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
    fetchInitialRecipes();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchInitialRecipes(filters.category, filters.area, filters.ingredient, term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // If all filters are cleared, also clear search and load fresh
    if (!newFilters.category && !newFilters.area && !newFilters.ingredient) {
      setSearchTerm('');
      fetchInitialRecipes('', '', '', '');
    } else {
      fetchInitialRecipes(newFilters.category, newFilters.area, newFilters.ingredient, searchTerm);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
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
