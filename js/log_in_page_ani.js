
function movie_poster_merge() {

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMDVjYzE4YTk5Y2U4MTc1Y2I4YTI2YjRmMzhkNjkxMCIsInN1YiI6IjY1MmY0OWU4MDI0ZWM4MDEwMTU0MTkyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fn5pNmujTnJOpP-y8uUDOYk0DX44yKCTXfaPIpm3a1M'
        }
    };
    for (let j = 1; j < 6; j++) {
        fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${j}`, options)
            .then(async (response) =>
                await response.json()).then(val => {
                    //val["results"][0]["poster_path"]
                    val["results"].forEach(element => {
                        let movie_poster = document.createElement("span");//
                        document.getElementById("logjoin_page").appendChild(movie_poster);//위에서 생성한 태그를 card의 자식으로 선언
                        let post = `<img src="https://image.tmdb.org/t/p/w300${element["poster_path"]}" alt="...">`;
                        movie_poster.innerHTML = post;
                    })

                }
                )
            .catch(err => console.error(err));
    }
}

movie_poster_merge();
