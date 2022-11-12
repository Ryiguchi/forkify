// import all (*) as model - to use, model.state, model.loadRecipe
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// need to import icons to connect them because parcel will change the JS file location

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import getQuery from './views/searchView.js';

const controlRecipes = async function () {
  try {
    // location = entire URL
    const id = window.location.hash.slice(1);
    // guard clause
    if (!id) return;
    recipeView.renderSpinner();
    // 0. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1. loading the recipe
    // loadRecipe is an async function so it returns a promise which we must handle with await
    // gives us access to model.state.recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;
    // 2. rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1. get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2. load search results
    await model.loadSearchResults(query);
    // 3. render results
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSearchResults();

const controlPagination = function (goToPage) {
  // 3. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 4. Render NEW pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings( in State)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add/remove bookmark
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);
  // 2.Update reipe view
  recipeView.update(model.state.recipe);
  // 3. render bookmarks in list
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show spinner
    addRecipeView.renderSpinner();

    // upload the new recipe
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back  goes to previous page

    // close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  // PUBLISHER - SUBSCRIBER PATTERN
  // subscribes to publisher by passing in the subscriber function
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
// listen for url hash change
// window.addEventListener('hashchange', controlRecipes);

// listen for page reload
// window.addEventListener('load', controlRecipes);
