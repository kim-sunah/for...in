const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNTVkOGU5NzhjNTQyZGQ0YjE2NWQ0MDhmNjQ1ZTgxMyIsInN1YiI6IjY1MzA3NGY4MGI3NGU5MDBhYmNmOTY3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BbAayICdXcDqCMAhKfcB6MK6IIkRfsujypX6hXGcRt8'
    }
};

fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

document.getElementById("showModalBtn").addEventListener("click", openModal);

function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

document.getElementById("closeModalBtn").addEventListener("click", closeModal);

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

document.getElementById("applyFilterBtn").addEventListener("click", applyFilter);

function applyFilter() {
    const selectedGenreId = document.getElementById("genreFilter").value;
    const apiURL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

    fetch(apiURL, options)
        .then(response => response.json())
        .then(data => {

        })
        .catch(err => console.error(err));
}

const genreList = [];

fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options)
    .then(response => response.json())
    .then(data => {
        genreList = data.genre_ids;
        populateGenreList();
    })
    .catch(err => console.error(err));

function populateGenreList() {
    const genreFilter = document.getElementById("genreFilter");
    genreList.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreFilter.appendChild(option);
    });
}