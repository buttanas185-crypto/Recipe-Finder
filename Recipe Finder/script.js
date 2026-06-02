const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const recipesContainer = document.getElementById('recipes-container');

const apiCalls = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("API Call Failed:", error);
    }
}

// Helper function to extract all ingredients and measurements into a list
const getIngredientsList = (meal) => {
    let ingredientsHtml = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        // If the ingredient exists and isn't empty, add it to our list
        if (ingredient && ingredient.trim() !== "") {
            ingredientsHtml += `<li>${measure ? measure.trim() : ""} ${ingredient.trim()}</li>`;
        }
    }
    return ingredientsHtml;
}

const getRecipeData = async () => {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        alert("Please type a meal name first!");
        return;
    }

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`;
    let data = await apiCalls(url);

    // Clear previous search results
    recipesContainer.innerHTML = "";

    if (data && data.meals) {
        // Take up to the first 5 recipes
        const limitedMeals = data.meals.slice(0, 5);

        limitedMeals.forEach(meal => {
            // Generate the list of ingredients for this specific meal
            const ingredientsList = getIngredientsList(meal);

            // Create a recipe card element
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');

            recipeCard.innerHTML = `
                <img class="recipe-img" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="details">
                    <h3 class="recipe-name">${meal.strMeal}</h3>
                    <p><strong>Category:</strong> <span>${meal.strCategory || "N/A"}</span></p>
                    <p><strong>Area/Origin:</strong> <span>${meal.strArea || "N/A"}</span></p>
                    
                    <div class="ingredients-wrapper">
                        <p><strong>Ingredients:</strong></p>
                        <ul class="recipe-ingredients-list">
                            ${ingredientsList}
                        </ul>
                    </div>

                    <div class="instructions-wrapper">
                        <p><strong>Instructions:</strong></p>
                        <p class="recipe-instructions">${meal.strInstructions}</p>
                    </div>
                </div>
                <hr class="recipe-divider">
            `;

            recipesContainer.appendChild(recipeCard);
        });
    } else {
        alert("No recipes found! Try searching for something else (e.g., 'cake', 'beef').");
    }
}

searchBtn.addEventListener("click", getRecipeData);

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getRecipeData();
    }
});
