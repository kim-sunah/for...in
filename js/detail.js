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

// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs, getDoc, deleteDoc, addDoc, collection, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { query, orderBy, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
// import { getAnalytics } from "firebase/analytics";

// Firebase 구성 정보 설정
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCauRZ02WOgnWSXDX7pEVv9xJ-g25bOyWE",
    authDomain: "sparta5-65934.firebaseapp.com",
    databaseURL: "https://sparta5-65934-default-rtdb.firebaseio.com",
    projectId: "sparta5-65934",
    storageBucket: "sparta5-65934.appspot.com",
    messagingSenderId: "381298859705",
    appId: "1:381298859705:web:b65a54d74b3b7f765b8568",
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//상세페이지 기본정보
function detailpage(response) {
    $("#title").text(response.title)
    $("#year").text(`(${response.release_date.slice(0, 4)})`)
    $("#release_date").text(`${response.release_date}(${response.production_countries[0].iso_3166_1})`)
    response.genres.forEach(element => {
        $("#genres").append(`${element.name}, `)
    });
    $("#genres").text($("#genres").text().slice(0, -2))
    $(".runtime").text(`${Math.floor(response.runtime / 60)}h ${response.runtime % 60}m`)
    $(".overview").text(response.overview)
    for (let i = 0; i < 6; i++) {
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
    $('#media_scroller').append(`
    <div class="h_scroller content scroller" id = "movie_images">
        <div class="backdrop">
            <img loading="lazy" class="backdrop"src="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${response.backdrop_path}"srcset="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${response.backdrop_path} 1x, https://www.themoviedb.org/t/p/w1066_and_h600_bestv2${response.backdrop_path} 2x"alt="${response.name}">
        </div>
        <div class="poster">
        <img class="poster" src="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path}" srcset="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path} 1x, https://www.themoviedb.org/t/p/w440_and_h660_face${response.poster_path} 2x" alt="늙은 아빠들"></div>
    </div>
        `)
    $('.image_content').html(`
    <img class="poster lazyload lazyloaded"
    src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path}"
    data-src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path}"
    data-srcset="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2${response.poster_path} 2x"
    alt="${response.title}"
    srcset="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2${response.poster_path} 2x"
    data-loaded="true">
    `)
    $('#backgroundImage').css('background-image', `url('https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${response.backdrop_path}')`)
    getCommentList(response)
}

async function getCommentList(response) {
    // console.log(url)
    const q = query(
        collection(db, String(url)),
        orderBy('date', 'desc')
    );
    let docs = await await getDocs(q);
    if (docs.size == 0) {
        $('.original_content').html(`
        <div class="review_container zero">
            <div class="content zero">
                <p class="no_margin" dir="auto">
                ${response.title}에 관한 리뷰가 없습니다. 
                <a href="review.html?id=${response.id}">리뷰 쓰기</a>
                </p>
            </div>
        </div>
        `)
    } else {
        $('.original_content').html(`
        <div class="discussion_container">
                    <table class="new space">
                        <thead>
                            <tr>
                                <th>주제</th>
                                <th>댓글</th>
                            </tr>
                        </thead>
                        <tbody id = "review_list">
                        </tbody>
                        </table>
                    </div>
        `)
        docs.forEach((doc) => {
            $('#review_list').append(`
                            <tr class="open">
                                <td class="subject">
                                    <div class="post_info">
                                        <div class="flex_wrapper">
                                            <div class="link_wrapper">
                                                <a href="reviewEdit.html?id=${response.id}&review_id=${doc.id}">${doc.data().review}</a>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p>${doc.data().date}<br> 작성자 : <span class="username"><a>${doc.data().userName}</a></span></p>
                                </td>
                            </tr>
                        
            `)
        })
        $('.original_content').append(`
        <p class="new_button"><a class="" href="review.html?id=${response.id}">리뷰 작성하기</a></p>
        `)
    }

    return docs;
}

//동영상 가져오기

//배경 이미지 가져오기
//포스터 가져오기
$('.menu li').click(function (e) {
    e.preventDefault();
    $('.menu li').removeClass('active');
    $(this).addClass('active');

    const liId = $(this).find('a').attr('id');
    const movieImages = $('#movie_images');

    // liId에 따라 다른 정보를 표시
    if (liId === 'popular') {
        fetch(`https://api.themoviedb.org/3/movie/${url}?append_to_response=credits&language=ko-kr`, options)
            .then(response => response.json())
            .then(response =>
                $('#media_scroller').html(`
        <div class="h_scroller content scroller" id = "movie_images">
            <div class="backdrop">
                <img loading="lazy" class="backdrop"src="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${response.backdrop_path}"srcset="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${response.backdrop_path} 1x, https://www.themoviedb.org/t/p/w1066_and_h600_bestv2${response.backdrop_path} 2x"alt="${response.name}">
            </div>
            <div class="poster">
            <img class="poster" src="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path}" srcset="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path} 1x, https://www.themoviedb.org/t/p/w440_and_h660_face${response.poster_path} 2x" alt="늙은 아빠들"></div>
        </div>
            `)
            ).catch(err => console.error(err));
    } else if (liId === 'videos') {
        $('#media_scroller').html(` <div class="h_scroller content scroller" id = "video_list"></div>`)
        fetch(`https://api.themoviedb.org/3/movie/${url}/videos?language=en-US`, options)
            .then(response => response.json())
            .then(response =>
                response.results.forEach(e => {
                    $('#video_list').append(`
                        <div class="video card no_border">
                            <div class="wrapper" style="background-image: url('https://i.ytimg.com/vi/${e.key}/hqdefault.jpg');">
                                <a class="no_click play_trailer"data-site="YouTube" data-id="${e.key}" data-title="Русский трейлер"><div class="play_background"><span class="glyphicons_v2 play invert svg"></span></div></a>
                            </div>
                        </div>
                    `)
                })
            )
            .catch(err => console.error(err));
        $(document).on('click', '.play_trailer', function (e) {
            e.preventDefault();
            const id = $(this).data('id');
            const title = $(this).data('title');
            $('body').append(`
            <div class="k-overlay" style="display: block; z-index: 10003; opacity: 0.5;"></div>
            <div class="k-widget k-window k-display-inline-flex k-state-focused" tabindex="0" style="min-width: 90px; min-height: 50px; width: 789px; height: 506px; display: none; top: 7.5px; left: 143.5px; background-color: rgb(0, 0, 0); border-color: rgb(0, 0, 0); position: fixed; z-index: 10004; opacity: 1;"><div class="k-window-titlebar" style="background-color: rgb(0, 0, 0); border-color: rgb(0, 0, 0); color: rgb(255, 255, 255);">
            <span class="k-window-title" id="video_popup_wnd_title">${title}</span><div class="k-window-actions"><a role="button" href="#" class="k-button k-flat k-button-icon k-window-action" aria-label="Close"><span class="k-icon k-i-close"></span></a></div></div><div id="video_popup" data-role="window" class="k-window-content" role="dialog" aria-labelledby="video_popup_wnd_title" style="display: block; padding: 0px; margin: 0px; background-color: rgb(0, 0, 0);">
            <title>Play NjbizH7cx5k on YouTube</title>
            <meta charset="utf-8">
            <style>
            body.trailer_iframe { background-color: #000; padding: 0; margin: 0; overflow: hidden; }
            iframe { background-color: #000; overflow: hidden; }
            </style>
            <iframe type="text/html" style="background-color: #000;" width="789" height="443" src="//www.youtube.com/embed/${id}?autoplay=1&amp;origin=https%3A%2F%2Fwww.themoviedb.org&amp;hl=ko&amp;modestbranding=1&amp;fs=1&amp;autohide=1" frameborder="0" allowfullscreen=""></iframe>
            </div></div>
            `)
            $('a[aria-label="Close"]').click(function (e) {
                e.preventDefault();
                $('.k-overlay').remove();
                $('.k-widget').remove();
            });
        });

    } else if (liId === 'backdrops') {
        $('#media_scroller').html(` <div class="h_scroller content scroller" id = "video_list"></div>`)
        fetch(`https://api.themoviedb.org/3/movie/${url}/images`, options)
            .then(response => response.json())
            .then(response => response.backdrops.forEach(e => {
                    $('#video_list').append(`
                    <div class="backdrop">
                    <img loading="lazy" class="backdrop" src="https://www.themoviedb.org//t/p/w533_and_h300_bestv2${e.file_path}" srcset="https://www.themoviedb.org//t/p/w533_and_h300_bestv2${e.file_path} 1x, https://www.themoviedb.org/t/p/w1066_and_h600_bestv2${e.file_path} 2x" alt="쏘우 10">
                    </div>
                    `)
            })
            ).catch(err => console.error(err));
    } else if (liId === 'posters') {
        $('#media_scroller').html(` <div class="h_scroller content scroller" id = "video_list"></div>`)
        fetch(`https://api.themoviedb.org/3/movie/${url}/images`, options)
            .then(response => response.json())
            .then(response =>
                response.posters.forEach(e => {
                    $('#video_list').append(`
                    <div class="backdrop">
                    <img loading="lazy" class="backdrop" src="https://www.themoviedb.org//t/p/w533_and_h300_bestv2${e.file_path}" srcset="https://www.themoviedb.org//t/p/w533_and_h300_bestv2${e.file_path} 1x, https://www.themoviedb.org/t/p/w1066_and_h600_bestv2${e.file_path} 2x" alt="쏘우 10">
                    </div>
                    `)
            })
            ).catch(err => console.error(err));
    }
});



