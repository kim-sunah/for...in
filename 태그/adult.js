const checkAdult = document.getElementById("flexCheck");


const adultOptions = {

    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNTVkOGU5NzhjNTQyZGQ0YjE2NWQ0MDhmNjQ1ZTgxMyIsInN1YiI6IjY1MzA3NGY4MGI3NGU5MDBhYmNmOTY3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BbAayICdXcDqCMAhKfcB6MK6IIkRfsujypX6hXGcRt8'
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
    let movieCards = [];
    const cardList = document.getElementById("cardList");

    cardList.innerHTML = '';

    movies.forEach(element => {
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
}
console.log("hello")