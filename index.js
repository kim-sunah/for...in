const cardList = document.getElementById("cardList");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    search(searchInput.value);
});

function search(searchWord) {
    cardList.innerHTML = "";
    for (let i = 1; i < 6; i++) {
        fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${i}`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzliNjIwOTFmMzY0Y2M4MzczMGExMzU3ZWM1YjE3ZCIsInN1YiI6IjY1MmY3NTcyMzU4ZGE3NWI1ZDAwODcyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j6JDptMTCwZT8Gkr2PbQ2rWV5r85H1fKNwS4iF1_o3U",
                },
            })
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                response.results
                    .filter((element) => element.original_title.toUpperCase().includes(searchWord.toUpperCase()))
                    .forEach((element) => {
                        const movieCard = document.createElement("div");
                        movieCard.classList.add("movieCard");
                        movieCard.id = element.id;
                        movieCard.onclick = () => movieClick(element.id);

                        movieCard.innerHTML = `
                            <img class="movieImg" src="https://image.tmdb.org/t/p/w500/${element.poster_path}" />
                            <h3 class="movieTitle">${element.original_title}</h3>
                            <p class="movieTxt">${element.overview}</p>
                            <p class="movieAverage">Rating: ${element.vote_average}</p>
                        `;

                        cardList.appendChild(movieCard);
                    });
            })
            .catch((err) => console.error(err));
    }
}

function movieClick(movieId) {
    alert("클릭한 영화 ID: " + movieId);
}

search("");