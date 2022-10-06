import './css/style.css';
import { getUser } from './pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const refs = {
    searchForm: document.querySelector('#search-form'),
    card: document.querySelector('.gallery'),
    updateButton: document.querySelector('.loading-images'),
}

refs.searchForm.addEventListener('submit', onSearch);
refs.updateButton.addEventListener('click', onLoadMore);

let page = 1;
let searchQuery = '';
let pageCount = 0;


function onSearch(e) {
    e.preventDefault();
    page = 1;
    pageCount = 0;
    refs.card.innerHTML = ''
    refs.updateButton.classList.add('is-hidden')
    searchQuery = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();
  if (!searchQuery) {
      return Notify.failure('Write more correctly');
    }
    getUser(searchQuery, page).then(createCards);
}

function createCards(data) {
    const imgArr = data.hits;
    const card = imgArr.map(
        ({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
        }) =>
            `<div class="photo-card post">
      <a class="gallery__item" href="${largeImageURL}" >
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item--current">
      <b>Likes: </b> ${likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${downloads}
    </p>
  </div>
</div>`,
    );
    refs.card.insertAdjacentHTML('beforeend', card.join(''));
    refs.updateButton.classList.remove('is-hidden');
    pageCount += imgArr.length;
    if (pageCount >= data.totalHits) {
        refs.updateButton.classList.add('is-hidden');
        return Notify.failure("We're sorry, but you've reached the end of search results.")
    } else if (imgArr.length === 0 || data.total === 0) {
        refs.updateButton.classList.add('is-hidden');
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    } else {}
    new SimpleLightbox('.photo-card a', {captionsData: 'alt'});
}

function onLoadMore() {
    page += 1;
    getUser(searchQuery, page).then(createCards);
}




