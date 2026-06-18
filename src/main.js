import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import getImagesByQuery from './js/pixabay-api.js';

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMore = document.querySelector('.loadMoreBtn');
const gallery = document.querySelector('.gallery');

iziToast.settings({
  timeout: 5000,
  resetOnHover: true,
  transitionIn: 'flipInX',
  maxWidth: '400px',
  position: 'topRight',
  transitionOut: 'flipOutX',
});
const searchState = {
  query: '',
  pageNumber: 1,
  totalHits: 0,
  perPage: 0,
};
const scrollGallery = () => {
  const res = gallery.getBoundingClientRect();
  const height = res.height * 2;
  return window.scrollBy({
    top: height,
    behavior: 'smooth',
  });
};
const handleFormSubmit = async event => {
  event.preventDefault();
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  searchState.query = '';
  searchState.pageNumber = 1;
  searchState.totalHits = 0;
  searchState.perPage = 0;

  const formData = new FormData(event.target);
  const userInput = formData.get('search-text');
  if (userInput.length === 0) {
    return;
  }
  try {
    const data = await getImagesByQuery(userInput, 1)
    if(data.hits.length ===0){
       throw new Error("no Images")
    }
    createGallery(data.hits);
    showLoadMoreButton();
    scrollGallery();
    searchState.query = userInput;
    searchState.totalHits = data.totalHits;
    searchState.pageNumber += 1;
    searchState.perPage += data.hits.length;
  } catch (error) {
    iziToast.error({
        message: `${error}`
    })
  }
  hideLoader();
  event.target.reset();
};
form.addEventListener('submit', handleFormSubmit);

const handleLoadMore = async () => {
  showLoader();
  const hasMoreResults = searchState.totalHits > searchState.perPage;
  if (!hasMoreResults) {
    hideLoadMoreButton();
    hideLoader();
    iziToast.info({
      message: "We're sorry, but you've reached the end of search results.",
    });
    searchState.query = '';
    searchState.pageNumber = 1;
    searchState.totalHits = 0;
    searchState.perPage = 0;
    return;
  }
  try {
    const data = await getImagesByQuery(
      searchState.query,
      searchState.pageNumber
    );
     if(data.hits.length ===0){
       throw new Error("no Images")
    }
    createGallery(data.hits);
    scrollGallery();
    showLoadMoreButton();
    searchState.pageNumber += 1;
    searchState.perPage += data.hits.length;
  } catch (error) {
       iziToast.error({
        message: `${error}`
    })
  }
  hideLoader();
};
loadMore.addEventListener('click', handleLoadMore);
