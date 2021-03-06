const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  if (images.length != 0) {
    setSpinner(false);
    setBackgroundActivity('hideBackground');
    imagesArea.style.display = 'block';
    // show gallery title
    galleryHeader.style.display = 'flex';
    document.getElementById('selection-text').innerText = 'Select image to create slider';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2 hover-over-image w-100 h-100';
      div.innerHTML = ` 
        <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
        <div class='text-block'>
          <button onclick='singleImageViewer("${image.downloads}", "${image.favorites}", "${image.largeImageURL}", "${image.likes}", "${image.views}")' id='full-view-button'>
            <img class='custom-img' src='images/expand.png' alt=''>
          </button>
        </div>`;
      gallery.appendChild(div)
    })
  }
  else {
    setSpinner(false);
    setAlert(true);
  }
}

const getImages = (query) => {
  const URL = `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`;
  fetch(URL)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

const singleImageViewer = (downloads, favorites, imgURL, likes, views) => {
  setSingleImageView(true);
  console.log("Entered");
  document.getElementById('downloads').innerText = 'Downloads: ' + downloads;
  document.getElementById('favorites').innerText = 'Downloads: ' + favorites;
  document.getElementById('likes').innerText = 'Downloads: ' + likes;
  document.getElementById('views').innerText = 'Downloads: ' + views;
  document.getElementById('card-image').src = imgURL;
}
const setSingleImageView = value => {
  if (value) {
    document.getElementById('single-image').style.display = 'block';
    imagesArea.style.display = 'none';
  }
  else {
    document.getElementById('single-image').style.display = 'none';
  }
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
    document.getElementById('selection-text').innerText = `${sliders.length} Selected`;
  } else {
    element.classList.remove('added');
    const indexOfImg = sliders.indexOf(img);
    sliders.splice(indexOfImg, 1);
    document.getElementById('selection-text').innerText = `${sliders.length} Selected`;
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    setModal("Select at least 2 images");
    return;
  }
  // check valid duration value
  const duration = document.getElementById('duration').value || 1000;
  if (duration <= 0) {
    setModal("Please provide valid number");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

// Spinner visibility
const setSpinner = value => {
  if (value) {
    document.getElementById('spinner').style.display = 'block';
  } else {
    document.getElementById('spinner').style.display = 'none';
  }
}

// Alert dialog
const setAlert = value => {
  if (value) {
    document.getElementById('alert').style.display = 'block';
  } else {
    document.getElementById('alert').style.display = 'none';
  }
}

searchBtn.addEventListener('click', function () {
  setSingleImageView(false);
  setSpinner(true);
  setAlert(false);
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  clearGallery();
  getImages(search.value);
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

search.addEventListener('keypress', event => {
  if (event.key == 'Enter') {
    searchBtn.click();
  }
})

const setBackgroundActivity = value => {
  if (value == 'hideBackground') {
    const backgroundImage = document.querySelector('.background-image-set');
    const searchSection = document.querySelector('#search-section');
    backgroundImage.style.backgroundImage = "url('images/mountain2.png')";
    searchSection.style.padding = "0 0";
    searchSection.style.marginBottom = "50px";
    document.querySelector('#head-text').innerText = "";
  }
}

const setModal = string => {
  document.getElementById('modal-title').innerText = "Warning";
  document.getElementById('model-body').innerText = string;
  document.getElementById('modal-button').click();
}

const clearGallery = () => {
  gallery.innerHTML = '';
  galleryHeader.style.display = 'none';
}

const goBack = () => {
  setSingleImageView(false);
  imagesArea.style.display = 'block';
  galleryHeader.style.display = 'flex';
}