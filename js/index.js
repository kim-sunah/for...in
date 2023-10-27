const cardList = document.getElementById("cardList");
const searchFrom = document.getElementById("searchFrom");
const searchInput = document.getElementById("search_input");
const movieCard = document.querySelector(".movieCard");
const search_word = new URL(document.location.href).searchParams.get('searchWord');

//우섭님꺼
const genreFilter = document.getElementById("genreFilter");
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
  Science_Fiction: 878,
  TV_Movie: 10770,
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

var movieClick = function (event) {
  location.href = `detail.html?id=${event}`;
};


const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzliNjIwOTFmMzY0Y2M4MzczMGExMzU3ZWM1YjE3ZCIsInN1YiI6IjY1MmY3NTcyMzU4ZGE3NWI1ZDAwODcyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j6JDptMTCwZT8Gkr2PbQ2rWV5r85H1fKNwS4iF1_o3U",
  },
};
let movieList = []

function loadData() {
  const promises = [];
  for (let i = 1; i < 6; i++) {
    const promise = fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${i}`, options)
      .then((response) => response.json())
      .then((response) => {
        response.results.forEach((element) => {
          const movie = element.original_title;
          const movieImage = element.poster_path;
          const movieOverview = element.overview;
          const movieAverage = element.vote_average;
          const movieId = element.id;
          const moviePopularity = element.popularity;
          const movieDate = element.release_date;
          const genre = element.genre_ids;
          movieList.push({
            movie,
            movieImage,
            movieOverview,
            movieAverage,
            movieId,
            moviePopularity,
            movieDate,
            genre,
          });
        });
      })
      .catch((err) => console.error(err))
    promises.push(promise);
  }
  Promise.all(promises)
    .then(() => {
      movieList.sort((a, b) => (a.movieAverage < b.movieAverage ? 1 : -1));
      search();
    });
}

window.onload = () => {
  if (localStorage.getItem('login_user')) {
    $('#is_login').html(
      `
      <a class="no_click tooltip_hover" id="userName" title="프로필과 설정" data-role="tooltip">${JSON.parse(localStorage.getItem('login_user'))["name"]}님 반갑습니다</a>
      <button id="log_out">Logout</button>
      `
    )
  }else{
    $('#is_login').html("<button id='log_join'>Login</button>")
  }
  if (search_word) searchInput.value = search_word
  searchInput.value = search_word != null ? search_word : null;
  loadData();
}
function sortChange(e) {
  if (e == "lowAverage") {
    movieList.sort((a, b) => (a.movieAverage > b.movieAverage ? 1 : -1));
    console.log("lowAverage")
    return search();
  } else if (e == "highAverage") {
    movieList.sort((a, b) => (a.movieAverage < b.movieAverage ? 1 : -1));
    console.log("lowAverage")
    return search();
  } else if (e == "new") {
    movieList.sort((a, b) =>
      new Date(a.movieDate) < new Date(b.movieDate) ? 1 : -1
    );
    console.log("lowAverage")
    return search();
  } else if (e == "abc") {
    movieList.sort((a, b) => (a.movie > b.movie ? 1 : -1));
    console.log("lowAverage")
    return search();
  } else if (e == "cba") {
    movieList.sort((a, b) => (a.movie < b.movie ? 1 : -1));
    console.log("lowAverage")
    return search();
  } else if (e == "popularity") {
    movieList.sort((a, b) => (a.moviePopularity < b.moviePopularity ? 1 : -1));
    console.log("lowAverage")
    return search();
  } else {
    console.log("lowAverage")
    return movieList.sort((a, b) => (a.movieAverage < b.movieAverage ? 1 : -1));
  }
}

genreFilter.addEventListener("change", () => {
  search();
});
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    search();
  }
});

document.getElementById("searchClick").addEventListener("click", function (event) {
  event.preventDefault();
  search();
});

function search(event) {
  if (event != null) {
    event.preventDefault();
  }
  // event.preventDefault();
  var searchWord = searchInput.value.toUpperCase()

  const searchgenre = genreFilter.value;
  cardList.innerHTML = "";
  movieList.filter((element) => {
    if (searchgenre != "장르") {
      if (
        element.movie.toUpperCase().includes(searchWord) &&
        element.genre.includes(parseInt(searchgenre))
      ) {
        return true;
      }
    } else {
      if (element.movie.toUpperCase().includes(searchWord)) {
        return true;
      }
    }
  }).map((element) => {
    cardList.innerHTML += `
            <div class = "movieCard" id = "${element.movieId}" onclick = "movieClick(${element.movieId})" >
                <img class = "movieImg" src = "https://image.tmdb.org/t/p/w500/${element.movieImage}"/>
                <div class = "cardBox">
                <h3 class = "movieTitle">${element.movie}</h3>
                <p class = "movieaverage">⭐ ${element.movieAverage}</p>
                <div class = "txtBox">
                <p class = "movieTxt" >${element.movieOverview}</p>
                </div>
                </div>
            </div>`;
  });
}