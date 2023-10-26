const closeModalBtn = document.getElementById("closeModalBtn");
const startBtn = document.getElementById("startBtn");
const modal = document.getElementById("myModal");
const genreFilter = document.getElementById("genreFilter");
const applyFilterBtn = document.getElementById("applyFilterBtn");

const genrelist = [];

const genreoptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNTVkOGU5NzhjNTQyZGQ0YjE2NWQ4BbAayICdXcDqCMAhKfcB6MK6IIkRfsujypX6hXGcRt8",
  },
};

const genrecategory = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Science Fiction": 878,
  "TV Movie": 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

const genreKeys = Object.keys(genrecategory);
genreKeys.forEach((genre) => {
  const option = document.createElement("option");
  option.value = genrecategory[genre];
  option.textContent = genre;
  genreFilter.appendChild(option);
});

function makegenrelist() {
  for (let i = 1; i < 6; i++) {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${i}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        data.results.forEach((element) => {
          const genre = element.genre_ids;
          genrelist.push({
            genre,
          });
        });
      })
      .catch((err) => console.error(err));
  }
}

makegenrelist();

startBtn.addEventListener("click", () => {
  console.log("test");
  modal.style.display = "block";
});

startBtn.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchMovies();
  }
});

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

applyFilterBtn.addEventListener("click", () => {
  searchMovies();
  modal.style.display = "none";
});

function searchMovies() {
  const cardList = document.getElementById("cardList");
  const searchgenre = genreFilter.value;
  var movieCards = [];

  for (let i = 1; i < 6; i++) {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${i}`,
      genreoptions
    )
      .then((response) => response.json())
      .then((data) => {
        const results = data.results;

        results.forEach((element) => {
          if (element.genre_ids.includes(parseInt(searchgenre))) {
            const movieCard = `
                            <div class="movieCard" id="${element.id}" onclick="movieClick(${element.id})">
                                <img class="movieImg" src="https://image.tmdb.org/t/p/w500/${element.poster_path}"/>
                                <h3 class="movieTitle">${element.original_title}</h3>
                                <p class="movieTxt">${element.overview}</p>
                                <p class="movieAverage">Rating: ${element.vote_average}</p>
                            </div>`;

            movieCards.push(movieCard);
          }
        });

        cardList.innerHTML = movieCards.join("");
      })
      .catch((err) => console.error(err));
  }
}
