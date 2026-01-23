const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const FEATURED_EVEN_IDS = ['52772', '52774', '52776', '52778'];

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

// Request configuration
const FETCH_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Start with 1 second

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch with timeout
 * @param {string} url - The URL to fetch
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Fetch with retry logic and exponential backoff
 * @param {string} url - The URL to fetch
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(url, retries = MAX_RETRIES) {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithTimeout(url);
      if (!response.ok && response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        const delay = RETRY_DELAY * Math.pow(2, i); // Exponential backoff
        console.log(`Retry ${i + 1}/${retries} after ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

/**
 * Get cached data or fetch and cache
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch data if not cached
 * @returns {Promise<any>}
 */
async function getCached(key, fetchFn) {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Cache hit: ${key}`);
    return cached.data;
  }
  
  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

// Available categories in MealDB API
export const MEAL_CATEGORIES = [
  'Beef', 'Chicken', 'Dessert', 'Lamb', 'Miscellaneous', 
  'Pasta', 'Pork', 'Seafood', 'Side', 'Starter', 
  'Vegan', 'Vegetarian', 'Breakfast', 'Goat'
];

// Available areas/cuisines in MealDB API
export const MEAL_AREAS = [
  'American', 'British', 'Canadian', 'Chinese', 'Croatian', 
  'Dutch', 'Egyptian', 'Filipino', 'French', 'Greek', 
  'Indian', 'Irish', 'Italian', 'Jamaican', 'Japanese', 
  'Kenyan', 'Malaysian', 'Mexican', 'Moroccan', 'Polish', 
  'Portuguese', 'Russian', 'Spanish', 'Thai', 'Tunisian', 
  'Turkish', 'Ukrainian', 'Vietnamese'
];

// Common ingredients for filtering
export const MEAL_INGREDIENTS = [
  'Chicken', 'Beef', 'Pork', 'Salmon', 'Tuna', 'Shrimp',
  'Potatoes', 'Tomatoes', 'Onions', 'Garlic', 'Rice', 'Pasta',
  'Eggs', 'Cheese', 'Milk', 'Butter', 'Olive Oil',
  'Mushrooms', 'Carrots', 'Broccoli', 'Spinach', 'Lettuce',
  'Flour', 'Sugar', 'Chocolate', 'Vanilla', 'Lemon'
];

/**
 * Search meals by name
 * @param {string} name - The meal name to search for
 * @returns {Promise<Array>} Array of meals
 */
export async function searchMealsByName(name) {
  const cacheKey = `search_${name}`;
  
  try {
    return await getCached(cacheKey, async () => {
      const response = await fetchWithRetry(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
      const data = await response.json();
      return data.meals || [];
    });
  } catch (error) {
    console.error('Error searching meals:', error);
    return [];
  }
}

/**
 * Get meal details by ID
 * @param {string} id - The meal ID
 * @returns {Promise<Object|null>} Meal details
 */
export async function getMealById(id) {
  const cacheKey = `meal_${id}`;
  
  try {
    return await getCached(cacheKey, async () => {
      const response = await fetchWithRetry(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    });
  } catch (error) {
    console.error('Error fetching meal by ID:', error);
    return null;
  }
}

/**
 * Get a random meal
 * @returns {Promise<Object|null>} Random meal
 */
export async function getRandomMeal() {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/random.php`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching random meal:', error);
    return null;
  }
}

/**
 * List all meal categories
 * @returns {Promise<Array>} Array of categories
 */
export async function getCategories() {
  const cacheKey = 'categories';
  
  try {
    return await getCached(cacheKey, async () => {
      const response = await fetchWithRetry(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Filter meals by category
 * @param {string} category - The category name
 * @returns {Promise<Array>} Array of meals
 */
export async function getMealsByCategory(category) {
  const cacheKey = `category_${category}`;
  
  try {
    return await getCached(cacheKey, async () => {
      const response = await fetchWithRetry(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
      const data = await response.json();
      return data.meals || [];
    });
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    return [];
  }
}

/**
 * Filter meals by area (cuisine)
 * @param {string} area - The area/cuisine name
 * @returns {Promise<Array>} Array of meals
 */
export async function getMealsByArea(area) {
  const cacheKey = `area_${area}`;
  
  try {
    return await getCached(cacheKey, async () => {
      const response = await fetchWithRetry(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
      const data = await response.json();
      return data.meals || [];
    });
  } catch (error) {
    console.error('Error fetching meals by area:', error);
    return [];
  }
}

/**
 * Filter meals by main ingredient
 * @param {string} ingredient - The main ingredient name
 * @returns {Promise<Array>} Array of meals
 */
export async function getMealsByIngredient(ingredient) {
  const cacheKey = `ingredient_${ingredient}`;
  
  try {
    return await getCached(cacheKey, async () => {
      const response = await fetchWithRetry(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
      const data = await response.json();
      return data.meals || [];
    });
  } catch (error) {
    console.error('Error fetching meals by ingredient:', error);
    return [];
  }
}

/**
 * List all areas (cuisines)
 * @returns {Promise<Array>} Array of areas
 */
export async function getAreas() {
  try {
    const response = await fetch(`${BASE_URL}/list.php?a=list`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
}

/**
 * Search meals by first letter
 * @param {string} letter - Single letter to search
 * @returns {Promise<Array>} Array of meals
 */
export async function searchMealsByFirstLetter(letter) {
  try {
    const response = await fetch(`${BASE_URL}/search.php?f=${letter}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching meals by letter:', error);
    return [];
  }
}

/**
 * Get multiple random meals
 * @param {number} count - Number of random meals to fetch
 * @returns {Promise<Array>} Array of random meals
 */
export async function getMultipleRandomMeals(count = 5) {
  try {
    const promises = Array(count).fill(null).map(() => getRandomMeal());
    const meals = await Promise.all(promises);
    return meals.filter(meal => meal !== null);
  } catch (error) {
    console.error('Error fetching multiple random meals:', error);
    return [];
  }
}

/**
 * Get featured meals limited to the first four even IDs starting from 52772
 * Uses lookup endpoint only
 * @returns {Promise<Array>} Array of meals
 */
export async function getFeaturedEvenMeals() {
  try {
    const meals = await Promise.all(FEATURED_EVEN_IDS.map((id) => getMealById(id)));
    return meals.filter(Boolean);
  } catch (error) {
    console.error('Error fetching featured meals:', error);
    return [];
  }
}

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} YouTube video ID or null
 */
export function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

/**
 * Extract ingredients and measurements from meal object
 * @param {Object} meal - Meal object from API
 * @returns {Array} Array of ingredient objects with name and measure
 */
export function extractIngredients(meal) {
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
  return ingredients;
}

/**
 * Check if a meal contains a specific ingredient
 * @param {Object} meal - Meal object from API
 * @param {string} ingredient - Ingredient name to search for
 * @returns {boolean} True if meal contains the ingredient
 */
export function mealHasIngredient(meal, ingredient) {
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    if (ing && ing.trim() && ing.toLowerCase().includes(ingredient.toLowerCase())) {
      return true;
    }
  }
  return false;
}
