const searchForm = document.getElementById("search-form");
const loadBtn = document.getElementById("loadBtn");
const galleryList = document.getElementById("galleryList");

const API_KEY = "53972215-908d74d328bb55f5faa57c2c1";
const PER_PAGE = 12;
let page = 1;
let searchText = " ";

async function drawPhotos(data) {
  const newPhoto = data
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) =>
        `
        <li class="list__item">
            <div class="photo-card">
                <img src=${webformatURL} alt=${tags} />
                <div class="stats">
                    <p class="stats-item">
                        <i class="material-icons">thumb_up</i>
                        ${likes}
                    </p>
                    <p class="stats-item">
                        <i class="material-icons">visibility</i>
                        ${views}
                    </p>
                    <p class="stats-item">
                        <i class="material-icons">comment</i>
                        ${comments}
                    </p>
                    <p class="stats-item">
                        <i class="material-icons">cloud_download</i>
                        ${downloads}
                    </p>
            </div>
            </div>
        </li>
        `
    )
    .join("");
  galleryList.insertAdjacentHTML("beforeend", newPhoto);
}

const getPhotos = async () => {
  return await fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchText}&page=${page}&per_page=${PER_PAGE}&key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => data.hits)
    .catch((error) => console.log(error));
};

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (event.currentTarget.elements.query.value === "") {
    clear();
    return;
  }
  const text = event.currentTarget.elements.query.value;
  searchText = text;
  clear();

  const images = await getPhotos();
  if (images.length === 0) {
    galleryList.innerHTML = "<p>Nothing</p>";
  } else {
    await load();
    loadBtn.style.display = "block";
  }
});

async function load() {
  const images = await getPhotos();
  drawPhotos(images);
}

function clear() {
  galleryList.innerHTML = "";
  page = 1;
}

if (loadBtn) {
  loadBtn.addEventListener("click", async () => {
    page += 1;
    await load();
  });
}
