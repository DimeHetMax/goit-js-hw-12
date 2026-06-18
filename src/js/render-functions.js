import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const galler = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const button = document.querySelector('.loadMoreBtn');
const buttonUp =document.querySelector(".scrollUp");

const lightbox = new SimpleLightbox('.gallery > li > a');
const galleryCard = ({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) => {
  return ` <li class="item">
              <a href=${largeImageURL}>
                <img src=${webformatURL} alt=${tags}>
                <div class="img_text_list">
                  <p><span>Likes</span>${likes}</p>
                  <p><span>Views</span>${views}</p>
                  <p><span>Comments</span>${comments}</p>
                  <p><span>Downloads</span>${downloads}</p>
                </div>
              </a>
            </li>`;
};
const createGallery = images => {
  const markup = images.map(galleryCard).join('');
  galler.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
};
const clearGallery = () => {
  galler.innerHTML = '';
};
const showLoader = () => {
  loader.classList.remove('visually-hidden');
};
const hideLoader = () => {
  loader.classList.add('visually-hidden');
};
const showLoadMoreButton = () => {
  button.classList.remove('visually-hidden');
};
const hideLoadMoreButton = () => {
  button.classList.add('visually-hidden');
};

const showScrollUpButton = () => {
  buttonUp.classList.remove('visually-hidden');
};
const hideScrollUpButton = () => {
  buttonUp.classList.add('visually-hidden');
};
export {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  showScrollUpButton,
  hideScrollUpButton
};
