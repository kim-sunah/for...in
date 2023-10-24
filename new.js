const cardList = document.getElementById("cardList");
const searchFrom = document.getElementById("search");
const searchInput = searchFrom.querySelector("input");
const movieCard = document.querySelector(".movieCard");
searchFrom.addEventListener("submit", search);

var movieClick = function (event) {
  alert(event);
};
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzliNjIwOTFmMzY0Y2M4MzczMGExMzU3ZWM1YjE3ZCIsInN1YiI6IjY1MmY3NTcyMzU4ZGE3NWI1ZDAwODcyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j6JDptMTCwZT8Gkr2PbQ2rWV5r85H1fKNwS4iF1_o3U",
  },
};

const movieList = [];

function loadData() {
  for (let i = 1; i < 6; i++) {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${i}`,
      options
    )
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
          movieList.push({
            movie,
            movieImage,
            movieOverview,
            movieAverage,
            movieId,
            moviePopularity,
            movieDate,
          });
        });
        var ascSortedList = movieList.sort((a, b) => a.movie > b.movie ? 1 : -1);
      })
      .catch((err) => console.error(err))
  }
}

loadData();
console.log(movieList)


// console.log(ascSortedList.sort())
// console.log(ascSortedList)


// function search(event) {
//   if (event != null) {
//     event.preventDefault();
//   }
//   const searchWord = searchInput.value.toUpperCase();
//   cardList.innerHTML = "";
//   var ascSortedList = movieList.sort((a, b) => a.movie > b.movie ? 1 : -1);

//   // movieList
//   //   .filter((element) => {
//   //     if (element.movie.toUpperCase().includes(searchWord)) {
//   //       return true;
//   //     }
//   //   })
//   //   .map((element) => {
//   //     cardList.innerHTML += `
//   //           <div class = "movieCard" id = "${element.movieId}" onclick = "movieClick(${element.movieId})" >
//   //               <img class = "movieImg" src = "https://image.tmdb.org/t/p/w500/${element.movieImage}"/>
//   //               <h3 class = "movieTitle">${element.movie}</h3>
//   //               <p class = "movieTxt" >${element.movieOverview}</p>
//   //               <p class = "movieaverage">Rating :  ${element.movieAverage}</p>
//   //           </div>`;
//   //   });
// }
