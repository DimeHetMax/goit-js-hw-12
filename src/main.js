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

iziToast.settings({
  timeout: 5000,
  resetOnHover: true,
  transitionIn: 'flipInX',
  maxWidth: '400px',
  position: 'topRight',
  transitionOut: 'flipOutX',
  iconUrl: './img/octagon.svg',
  messageColor: '#fff',
  color: '#EF4040',
});
const searchState = {
  query: '',
  pageNumber: 1,
  totalHits: 0,
  perPage: 0,
};
const scrollGallery = () => {
  const item = document.querySelector('.item');
  if(!item) return;

  const cardHeight = item.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};
const resetSearchState = () => {
  searchState.query = '';
  searchState.pageNumber = 1;
  searchState.totalHits = 0;
  searchState.perPage = 0;
};
const handleFormSubmit = async event => {
  event.preventDefault();
  clearGallery();
  hideLoadMoreButton();
  resetSearchState();
  const formData = new FormData(event.target);
  const userInput = formData.get('search-text');

  if (userInput.length === 0) {
    return;
  }
  showLoader();

  try {
    const data = await getImagesByQuery(userInput, 1);
    if (data.hits.length === 0) {
      throw new Error('no Images');
    }
    createGallery(data.hits);

    const hasMoreResults = data.totalHits > data.hits.length;
    if (!hasMoreResults) {
      hideLoadMoreButton();
      hideLoader();
      iziToast.info({
        iconUrl: '',
        message: 'No content to load',
      });
    }

    showLoadMoreButton();
    scrollGallery();
    

    searchState.query = userInput;
    searchState.totalHits = data.totalHits;
    searchState.pageNumber += 1;
    searchState.perPage += data.hits.length;
  } catch (error) {
    iziToast.error({
      message: `${error.message}`,
    });
  }
  hideLoader();
  event.target.reset();
};
form.addEventListener('submit', handleFormSubmit);

const handleLoadMore = async () => {
  showLoader();
  hideLoadMoreButton();
  const hasMoreResults = searchState.totalHits > searchState.perPage;
  if (!hasMoreResults) {
    hideLoadMoreButton();
    hideLoader();
    iziToast.info({
      iconUrl: '',
      message: "We're sorry, but you've reached the end of search results.",
    });
    resetSearchState();
    return;
  }
  try {
    const data = await getImagesByQuery(
      searchState.query,
      searchState.pageNumber
    );
    if (data.hits.length === 0) {
      throw new Error('no Images');
    }
    createGallery(data.hits);
    showLoadMoreButton();
    scrollGallery();
    searchState.pageNumber += 1;
    searchState.perPage += data.hits.length;
  } catch (error) {
    iziToast.error({
      message: `${error.message}`,
    });
  }
  hideLoader();
};
loadMore.addEventListener('click', handleLoadMore);
