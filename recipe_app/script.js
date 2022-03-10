const mealsEl = document.getElementById('meals');
const favContainer = document.getElementById('fav-meals');
const mealPopup = document.getElementById('meal-popup');
const mealInfoEl = document.getElementById('meal-info');
const popupCloseBtn = document.getElementById('close-popup');

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

getRandomMeal();
fetchFavMeals();

//fetch data from API

async function getRandomMeal() {
    const fetchMeals = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const fetchedData = await fetchMeals.json();
    const randomMeal = fetchedData.meals[0];
    addMeal(randomMeal, true);
}

async function getMealByID(id) {
    const fetchMeals = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
    const fetchedData = await fetchMeals.json();
    const meal = fetchedData.meals[0];
    return meal;
}

async function getMealsBySearch(term) {
    const fetchMeals = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

    const fetchedData = await fetchMeals.json();
    const meal = fetchedData.meals;

    return meal;
} 

//function operation

function addMeal(mealData, random = false) {
    
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = `
        <div class="meal-header">
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn" on><i class="fas fa-heart"></i></button>
        </div>
    `;

    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }
        fetchFavMeals();
    });
    
    meal.addEventListener('click', () => {
        showMealInfo(mealData);
    });

    mealsEl.appendChild(meal);
}

function addMealLS(mealID) {
    const mealIDs = getMealsLS();
 
    localStorage.setItem('mealIDs', JSON.stringify([...mealIDs,mealID]));
}

function removeMealLS(mealID) {
    const mealIDs = getMealsLS();

    localStorage.setItem('mealIDs', JSON.stringify(mealIDs.filter(id => id !== mealID)));
}

function getMealsLS() {
    const mealIDs = JSON.parse(localStorage.getItem('mealIDs'));

    return mealIDs === null ? [] : mealIDs;
}

async function fetchFavMeals() {

    favContainer.innerHTML = "";
    const mealIDs = getMealsLS();

    for (let i=0; i<mealIDs.length; i++) {
        const mealID = mealIDs[i];
        meal = await getMealByID(mealID);

        addMealFav(meal);
    }

    console.log(meals);
    //add to fav
}

function addMealFav(mealData, random = false) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
        <button class="remove-fav"><i class="fas fa-times"></i></button>
    `;

    const btn = favMeal.querySelector('.remove-fav');

    btn.addEventListener("click", () => {
        removeMealLS(mealData.idMeal);
        fetchFavMeals();
    })

    favMeal.addEventListener('click', () => {
        showMealInfo(mealData);
    })

    favContainer.appendChild(favMeal);
}

searchBtn.addEventListener('click', async () => {

    mealsEl.innerHTML = "";
    const search = searchTerm.value;
    
    const meals = await getMealsBySearch(search);
    
    if(meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        });        
    } else {
        mealsEl.innerHTML = `
            <h3>No Result Found</h3>
        `;
    }
});

function showMealInfo(mealData) {
    // clean it up
    mealInfoEl.innerHTML = "";

    // update the Meal info
    const mealEl = document.createElement("div");

    const ingredients = [];

    // get ingredients and measures
    for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
            ingredients.push(
                `${mealData["strIngredient" + i]} - ${
                    mealData["strMeasure" + i]
                }`
            );
        } else {
            break;
        }
    }

    mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <p>
        ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients
                .map(
                    (ing) => `
            <li>${ing}</li>
            `
                )
                .join("")}
        </ul>
    `;

    mealInfoEl.appendChild(mealEl);

    // show the popup
    mealPopup.classList.remove("hidden");
}

popupCloseBtn.addEventListener("click", () => {
    mealPopup.classList.add("hidden");
});