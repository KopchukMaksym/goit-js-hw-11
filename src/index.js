import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhotosByQuery } from './js/searchImg';
import galleryHbs from './tamplates/imgPage.hbs';
import Notiflix from 'notiflix';

const formEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
// console.log(galleryEl);
// console.dir(formEl);
let page = 1;
let per_page = 40;
const onSearchFormSubmit = async event => {
  event.preventDefault();
  const query = formEl.elements.searchQuery.value;

  try {
    const { data } = await fetchPhotosByQuery(query, page);
    // console.log(data);
    if (data.hits.length === 0) {
      galleryEl.innerHTML = '';
      loadBtn.classList.add('is-hidden');
      event.target.reset();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (data.totalHits < per_page) {
      galleryEl.innerHTML = galleryHbs(data.hits);
      loadBtn.classList.add('is-hidden');
      return;
    }
    galleryEl.innerHTML = galleryHbs(data.hits);
    lightbox.refresh();
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    loadBtn.classList.remove('is-hidden');
  } catch (err) {
    console.log(err);
  }
};

const loadMoreBtn = async () => {
  page += 1;
  const query = formEl.elements.searchQuery.value;
  try {
    const { data } = await fetchPhotosByQuery(query, page);
    if (page * per_page < data.totalHits) {
      loadBtn.classList.remove('is-hidden');
    } else {
      loadBtn.classList.add('is-hidden');
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    galleryEl.insertAdjacentHTML('beforeend', galleryHbs(data.hits));
    lightbox.refresh();
    scroll();
  } catch (err) {
    console.log(err);
  }
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionType: 'attr',
  captionsData: 'alt',
  captionDelay: 250,
});

const scroll = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};
loadBtn.addEventListener('click', loadMoreBtn);

formEl.addEventListener('submit', onSearchFormSubmit);
