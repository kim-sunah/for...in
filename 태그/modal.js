const closeModalBtn = document.getElementById("closeModalBtn");
const startBtn = document.getElementById("startBtn");
const modal = document.getElementById("myModal");
const genreFilter = document.getElementById("genreFilter");
const genreTranslations = {
    "Action": "액션",
    "Adventure": "모험",
    "Animation": "애니메이션",
    "Comedy": "코미디",
    "Crime": "범죄",
    "Documentary": "다큐멘터리",
    "Drama": "드라마",
    "Family": "가족",
    "Fantasy": "판타지",
    "History": "역사",
    "Horror": "호러",
    "Music": "음악",
    "Mystery": "미스터리",
    "Romance": "로맨스",
    "Science Fiction": "과학 소설",
    "TV Movie": "TV 영화",
    "Thriller": "스릴러",
    "War": "전쟁",
    "Western": "서부",
};

const Options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzliNjIwOTFmMzY0Y2M4MzczMGExMzU3ZWM1YjE3ZCIsInN1YiI6IjY1MmY3NTcyMzU4ZGE3NWI1ZDAwODcyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j6JDptMTCwZT8Gkr2PbQ2rWV5r85H1fKNwS4iF1_o3U",
    },
};

startBtn.addEventListener("click", () => {
    console.log("test");
    modal.style.display = "block";
});

startBtn.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        searchMovies();
    }
});

fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', Options)
    .then(response => response.json())
    .then(data => {
        const genres = data.genres;

        genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.id;
            option.text = genreTranslations[genre.name] || genre.name;

            genreFilter.appendChild(option);
        });
    })
    .catch(error => console.error(error));

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

applyFilterBtn.addEventListener("click", () => {
    searchMovies();
    modal.style.display = "none";
});

function searchMovies(event) {
    if (event != null) {
        event.preventDefault();
    }

    const searchgenre = genreFilter.value;
    const cardList = document.getElementById("cardList");

    var movieCards = [];

    fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${searchgenre}&language=en`, Options)
        .then(response => response.json())
        .then(data => {
            const results = data.results;

            results.forEach(element => {
                const movieCard = `
                    <div class="movieCard" id="${element.id}" onclick="movieClick(${element.id})">
                        <img class="movieImg" src="https://image.tmdb.org/t/p/w500/${element.poster_path}"/>
                        <h3 class="movieTitle">${element.original_title}</h3>
                        <p class="movieTxt">${element.overview}</p>
                        <p class="movieAverage">Rating: ${element.vote_average}</p>
                    </div>`;

                movieCards.push(movieCard);
            });

            cardList.innerHTML = movieCards.join("");
        })
        .catch(err => console.error(err));
}