const showModalBtn = document.getElementById("applyFilterBtn")
const closeModalBtn = document.getElementById("closeModalBtn")
const applyFilterBtn = document.getElementById("applyFilterBtn")


const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzliNjIwOTFmMzY0Y2M4MzczMGExMzU3ZWM1YjE3ZCIsInN1YiI6IjY1MmY3NTcyMzU4ZGE3NWI1ZDAwODcyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j6JDptMTCwZT8Gkr2PbQ2rWV5r85H1fKNwS4iF1_o3U",
    },
};
genres.forEach((genre_ids) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.text = genre.name;
    genreFilter.appendChild(option);
});

showModalBtn.addEventListener("click", () => {
    console log("test")
    modal.style.display = "block";

});

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

/
applyFilterBtn.addEventListener("click", () => {
    search();
});

function search(event) {
    if (event != null) {
        event.preventDefault();
    }
    const searchgenre = option.id;
    cardList.innerHTML = "";

    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
        .then(response => response.json())
        .then(response => {
            response.results
                .filter((element) => element.genre.includes(searchgenre))
                .map((element) => {

                    cardList.innerHTML += `
                            <div class="movieCard" id="${element.id}" onclick="movieClick(${element.id})">
                                <img class="movieImg" src="https://image.tmdb.org/t/p/w500/${element.poster_path}"/>
                                <h3 class="movieTitle">${element.original_title}</h3>
                                <p class="movieTxt">${element.overview}</p>
                                <p class="movieAverage">Rating: ${element.vote_average}</p>
                            </div>`;
                });
        })
        .catch((err) => console.error(err));
}


const searchForm = document.getElementById("search");
const searchInput = searchForm.querySelector("input");
const searchBtn = searchForm.querySelector("button");

searchForm.addEventListener("click", search);


search();