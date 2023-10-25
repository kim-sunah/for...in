const closeModalBtn = document.getElementById("closeModalBtn")
const startBtn = document.getElementById("startBtn")
const modal = document.getElementById("myModal");
const genreFilter = document.getElementById("genreFilter")


const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzliNjIwOTFmMzY0Y2M4MzczMGExMzU3ZWM1YjE3ZCIsInN1YiI6IjY1MmY3NTcyMzU4ZGE3NWI1ZDAwODcyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j6JDptMTCwZT8Gkr2PbQ2rWV5r85H1fKNwS4iF1_o3U",
    },
};

startBtn.addEventListener("click", () => {
    console.log("test")
    modal.style.display = "block"

});

fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then(response => response.json())
    .then(data => {

        const genres = data.genres;

        genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.id;
            option.text = genre.name;
            genreFilter.appendChild(option);
        });
    })
    .catch(error => console.error(error));

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});


applyFilterBtn.addEventListener("click", () => {
    search();
    modal.style.display = "none";
});
console.log("hello")

function search(event) {
    if (event != null) {
        event.preventDefault();
    }

    const searchgenre = genreFilter.value;
    const cardList = document.getElementById("cardList");

    let movieCards = [];


    fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${searchgenre}&language=en`, options)
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