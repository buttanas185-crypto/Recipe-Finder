const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const info = document.querySelector('.info');

const recipeName = document.querySelector('.recipe-name');
const recipeCategory = document.querySelector('.recipe-category');
const recipeArea = document.querySelector('.recipe-area');
const recipeInstructions = document.querySelector('.recipe-instructions');
const recipeImg = document.querySelector('.recipe-img');

const apiCalls = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("API Call Failed:", error);
    }
}

const getRecipeData = async () => {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        alert("Please type a meal name first!");
        return;
    }

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`;
    let data = await apiCalls(url);

    if (data && data.meals) {
        console.log('Total Recipes: ' +  data.meals.length)
        console.log(JSON.stringify(data.meals))
        const meal = data.meals[0]; // Select the first result
        
        recipeName.innerText = meal.strMeal;
        recipeImg.src = meal.strMealThumb;
        recipeCategory.innerText = meal.strCategory || "N/A";
        recipeArea.innerText = meal.strArea || "N/A";
        recipeInstructions.innerText = meal.strInstructions;
        
        info.style.display = "block";
    } else {
        alert("No recipes found! Try searching for something else (e.g., 'cake', 'beef').");
        info.style.display = "none";
    }
}

searchBtn.addEventListener("click", getRecipeData);

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getRecipeData();
    }
});