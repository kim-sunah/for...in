const url = new URL(document.location.href).searchParams.get('id');
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzliNjIwOTFmMzY0Y2M4MzczMGExMzU3ZWM1YjE3ZCIsInN1YiI6IjY1MmY3NTcyMzU4ZGE3NWI1ZDAwODcyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j6JDptMTCwZT8Gkr2PbQ2rWV5r85H1fKNwS4iF1_o3U'
    }
};
fetch(`https://api.themoviedb.org/3/movie/${url}?append_to_response=credits&language=ko-kr`, options)
    .then(response => response.json())
    .then(response =>
        // console.log(response)
        detailpage(response)
    )
    .catch(err => console.error(err));
    
function detailpage(response) {
    console.log(response)
    $("#title").text(response.title)
    $("#year").text(`(${response.release_date.slice(0, 4)})`)
    $("#release_date").text(`${response.release_date}(${response.production_countries[0].iso_3166_1})`)
    response.genres.forEach(element => {
        $("#genres").append(`${element.name}, `)
    });
    $("#genres").text($("#genres").text().slice(0, -2))
    $(".runtime").text(`${Math.floor(response.runtime / 60)}h ${response.runtime % 60}m`)
    $(".overview").text(response.overview)
    for (var i = 0; i < 6; i++) {
        $("#credits").append(`
        <li class="card">
            <a>
                <img loading="lazy" class="profile" src="https://www.themoviedb.org/t/p/w276_and_h350_face${response.credits.cast[i].profile_path}" 
                srcset="https://www.themoviedb.org/t/p/w276_and_h350_face${response.credits.cast[i].profile_path} 1x, https://www.themoviedb.org/t/p/w276_and_h350_face${response.credits.cast[i].profile_path} 2x" alt="${response.credits.cast[i].name}">
            </a>
            <p><a>${response.credits.cast[i].name}</a></p>
            <p class="character">${response.credits.cast[i].character}</p>
         </li>
        `)
        response.credits.cast[i]
    }
    $('#movie_images').append(`
        <div class="backdrop">
            <img loading="lazy" class="backdrop"src="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${response.backdrop_path}"srcset="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${response.backdrop_path} 1x, https://www.themoviedb.org/t/p/w1066_and_h600_bestv2${response.backdrop_path} 2x"alt="${response.name}">
        </div>
        <div class="poster">
        <img class="poster" src="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path}" srcset="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path} 1x, https://www.themoviedb.org/t/p/w440_and_h660_face${response.poster_path} 2x" alt="늙은 아빠들"></div>
    `)
    $('.original_content').append(`
    <div class="review_container zero">
        <div class="content zero">
            <p class="no_margin" dir="auto">
            ${response.title}에 관한 리뷰가 없습니다. 
            <a href="review.html?id=${response.id}">리뷰 쓰기</a>
            </p>
        </div>
    </div>
    `)
    $('.image_content').append(`
    <img class="poster lazyload lazyloaded"
    src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path}"
    data-src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path}"
    data-srcset="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2${response.poster_path} 2x"
    alt="${response.title}"
    srcset="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2${response.poster_path} 2x"
    data-loaded="true">
    `)
    $('#backgroundImage').css('background-image' , `url('https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${response.backdrop_path}')`)
}