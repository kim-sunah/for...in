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

function search(event) {
  if (event != null) {
    event.preventDefault();
  }
  const searchWord = searchInput.value.toUpperCase();
  cardList.innerHTML = "";
  for (let i = 1; i < 6; i++) {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${i}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        response.results
          .filter((element) => {
            if (element.original_title.toUpperCase().includes(searchWord)) {
              return true;
            }
          })
          .map((element) => {
            cardList.innerHTML += `
                    <div class = "movieCard" id = "${element.id}" onclick = "movieClick(${element.id})" >
                        <img class = "movieImg" src = "https://image.tmdb.org/t/p/w500/${element.poster_path}"/>
                        <h3 class = "movieTtile">${element.original_title}</h3>
                        <p class = "movieTxt" >${element.overview}</p>
                        <p class = "movieverage">Rating :  ${element.vote_average}</p>
                    </div>`;
          });
      })
      .catch((err) => console.error(err));
  }
}
search();
