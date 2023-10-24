const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzliNjIwOTFmMzY0Y2M4MzczMGExMzU3ZWM1YjE3ZCIsInN1YiI6IjY1MmY3NTcyMzU4ZGE3NWI1ZDAwODcyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j6JDptMTCwZT8Gkr2PbQ2rWV5r85H1fKNwS4iF1_o3U'
    }
};
fetch('https://api.themoviedb.org/3/movie/238?append_to_response=credits&language=ko-kr', options)
    .then(response => response.json())
    .then(response =>
        detailpage(response)
    )
    .catch(err => console.error(err));
function review() {
    location.href('review.html')
}

function detailpage(response) {
    console.log(response)
    $(".txt_tit").text(response.title)
    $(".movie_image").html(`
        <img class="bg_img" src="https://image.tmdb.org/t/p/w500/${response.poster_path}"
                        alt="">
    `)
    $(".txt_name").text(`${response.original_title}, ${response.release_date}`)
    $(".release_date").text(response.release_date)
    $(".vote_average").text(response.vote_average)
    response.genres.forEach(element => {
        $(".genres").append(`${element.name}/`)
    });
    $(".genres").text($(".genres").text().slice(0, -1))
    $(".production_countries").text(response.production_countries[0].name)
    $('.runtime').text(`${response.runtime} 분`)
    $('.contents').html(`
    <h4 class="screen_out">주요정보</h4>
        <div class="detail_basicinfo">
            <div class="movie_summary">
                <div class="info_desc" data-tiara-layer="desc">
                    <div class="desc_cont expand" id="overview">
                        ${response.overview.replace(/\. /g, '.<br/>')}
                    </div>
                </div>
            </div>
        </div>
    <button onclick="location.href = 'review.html?movie_id=${response.id}'">리뷰</button>
    `)
}