const checkAdult = document.getElementById("flexCheck");
const cardList = document.getElementById("cardList");

const adultOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNTVkOGU5NzhjNT4yZGQ0YjE2NWQ0MDhmNjQ1ZTgxMyIsInN1YiI6IjY1MzA3NGY4MGI3NGU5MD4wYmNmOTY3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BbAayICdXcDqCMAhKfcB6MK6IIkRfsujypX6hXGcRt8'
    }
};

checkAdult.addEventListener('click', function() {
    adultsearch();
});

function adultsearch() {
    if (checkAdult.checked) {
        fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`, adultOptions)
            .then(response => response.json())
            .then(data => {
                const adultMovies = data.results.filter(movie => movie.adult === true);

                if (adultMovies.length > 0) {
                    displayMovies(adultMovies);
                } else {
                    alert("존재하지 않는 영화입니다.");
                    window.location.reload();
                }
            })
            .catch(err => console.log(err));
    } else {
        window.location.reload();
    }
}

function displayMovies(movies) {
    cardList.innerHTML = '';

    movies.forEach(element => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movieCard");
        movieCard.id = element.id;
        movieCard.addEventListener("click", function () {
            movieClick(element.id);
        });

        const movieImg = document.createElement("img");
        movieImg.classList.add("movieImg");
        movieImg.src = `https://image.tmdb.org/t/p/w500/${element.poster_path}`;
        movieCard.appendChild(movieImg);

        const movieTitle = document.createElement("h3");
        movieTitle.classList.add("movieTitle");
        movieTitle.textContent = element.original_title;
        movieCard.appendChild(movieTitle);

        const movieTxt = document.createElement("p");
        movieTxt.classList.add("movieTxt");
        movieTxt.textContent = element.overview;
        movieCard.appendChild(movieTxt);

        const movieAverage = document.createElement("p");
        movieAverage.classList.add("movieAverage");
        movieAverage.textContent = `Rating: ${element.vote_average}`;
        movieCard.appendChild(movieAverage);

        cardList.appendChild(movieCard);
    });
}

console.log("hello");
