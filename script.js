const apiKey = 'b55d8e978c542dd4b165d408f645e813';
const baseUrl = 'https://api.themoviedb.org/3';
const imageSize = 'w500';


fetch(`${baseUrl}/movie/top_rated?language=en-US&page=1&api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {

        renderMovies(data.results);
    })
    .catch(err => console.error('영화 데이터를 가져오는 중 오류 발생:', err));

function fetchTopRatedMovies() {
    return fetch(`${baseUrl}/movie/top_rated?language=en-US&page=1&api_key=${apiKey}`)
        .then(response => response.json());
}

fetchTopRatedMovies()
    .then(data => {
        renderMovies(data.results);
    })
    .catch(err => console.error('영화 데이터를 가져오는 중 오류 발생:', err));


const moviesContainer = document.getElementById('movies-container');




let movies = []; // 영화 데이터를 저장할 배열
moviesContainer.innerHTML = '';

// 각각의 영화 카드를 생성하는 함수
const createMovieCard = movie => {
    const {
        id,
        title,
        overview,
        poster_path,
        vote_average
    } = movie;

    const card = document.createElement('div');
    card.className = 'movie-card';

    const image = document.createElement('img');
    image.className = 'poster-image';
    image.src = `https://image.tmdb.org/t/p/${imageSize}/${poster_path}`;
    card.appendChild(image);

    const titleElement = document.createElement('h2');
    titleElement.className = 'title';
    titleElement.textContent = title;
    card.appendChild(titleElement);

    const overviewElement = document.createElement('p');
    overviewElement.className = 'overview';
    overviewElement.textContent = overview;
    card.appendChild(overviewElement);

    const voteAverageElement = document.createElement('p');
    voteAverageElement.className = 'vote-average';
    voteAverageElement.textContent = `평균 평점: ${vote_average}`;
    card.appendChild(voteAverageElement);

    card.setAttribute('id', id);

    return card;
};

// 영화를 렌더링하여 화면에 나타내는 함수
const renderMovies = moviesData => {
    movies = moviesData;
    moviesContainer.innerHTML = '';

    moviesData.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesContainer.appendChild(movieCard);

        movieCard.addEventListener('click', () => {
            const movieId = movieCard.getAttribute('id');
            alert(`이 영화의 ID는 ${movieId}입니다`);
        });
    });
};

//serch를 넣기위한 함수
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

const searchMovies = () => {
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm) {
        fetchTopRatedMovies() // 영화 데이터를 다시 가져옴
            .then(data => {
                const filteredMovies = data.results.filter(movie => movie.title.toLowerCase().includes(searchTerm));
                renderMovies(filteredMovies);
            })
            .catch(err => console.error('영화 데이터를 가져오는 중 오류 발생:', err));
    } else {

        renderMovies(movies);
    }
};

// ...

searchButton.addEventListener('click', searchMovies);

searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        searchMovies();
    }
});
searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        searchMovies();
    }
});