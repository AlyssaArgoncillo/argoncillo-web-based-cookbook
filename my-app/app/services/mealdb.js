const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const FEATURED_EVEN_IDS = ['52772', '52774', '52776', '52778'];

/**
 * Search meals by name
 * @param {string} name - The meal name to search for
 * @returns {Promise<Array>} Array of meals
 */
export async function searchMealsByName(name) {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
    const data = await response.json();
    return data.meals || [];
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
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
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
    const response = await fetch(`${BASE_URL}/random.php`);
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
  try {
    const response = await fetch(`${BASE_URL}/categories.php`);
    const data = await response.json();
    return data.categories || [];
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
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await response.json();
    return data.meals || [];
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
  try {
    const response = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching meals by area:', error);
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
