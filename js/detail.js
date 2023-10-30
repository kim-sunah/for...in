// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Firebase 구성 정보 설정
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

// 로그인 상태 확인
const userSession = sessionStorage.getItem('userData');
const user = JSON.parse(userSession);
const _REVIEW = "review";
let reviewArr = [];
let movieReviewArr = [];

if (JSON.parse(localStorage.getItem(_REVIEW))) {
    reviewArr = JSON.parse(localStorage.getItem(_REVIEW));
}

const url = new URL(document.location.href).searchParams.get('id');

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'YOUR_AUTHORIZATION_TOKEN'
    }
};

fetch(`https://api.themoviedb.org/3/movie/${url}?append_to_response=credits&language=ko-kr`, options)
    .then(response => response.json())
    .then(response => detailpage(response))
    .catch(err => console.error(err));

for (let i of reviewArr) {
    if (i.movieId === url) {
        movieReviewArr.push(i);
    }
}

if (user) {
    console.log("log in");
    // 사용자가 로그인한 경우
    $('#is_login').html(
        `
        <a class="no_click tooltip_hover" id="userName" title="프로필과 설정" data-role="tooltip">${user.displayName}님 반갑습니다</a>
        <button id="log_out">Logout</button>
        `
    );

    $("#log_out").click(function () {
        signOut(auth)
            .then(() => {
                // 로그아웃 성공 시 처리
                sessionStorage.removeItem('userData');
                alert("로그아웃 성공!");
                location.reload();
            })
            .catch((error) => {
                // 로그아웃 실패 시 처리
                alert("로그아웃 실패: " + error);
            });
    });
} else {
    // 사용자가 로그인하지 않은 경우
    $('#is_login').html(`<button id='log_join.html' onClick="location.href='log_join.html'">Login</button>`);
}

// 상세페이지 기본 정보
function detailpage(response) {
    $("#title").text(response.title);
    $("#year").text(`(${response.release_date.slice(0, 4)})`);
    $("#release_date").text(`${response.release_date}(${response.production_countries[0].iso_3166_1})`);
    response.genres.forEach(element => {
        $("#genres").append(`${element.name}, `);
    });
    $("#genres").text($("#genres").text().slice(0, -2));
    $(".runtime").text(`${Math.floor(response.runtime / 60)}h ${response.runtime % 60}m`);
    $(".overview").text(response.overview);
    
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
        `);
        response.credits.cast[i];
    }

    $('#media_scroller').append(`
    <div class="h_scroller content scroller" id="movie_images">
        <div class="backdrop">
            <img loading="lazy" class="backdrop" src="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${response.backdrop_path}" srcset="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${response.backdrop_path} 1x, https://www.themoviedb.org/t/p/w1066_and_h600_bestv2${response.backdrop_path} 2x" alt="${response.name}">
        </div>
        <div class="poster">
            <img class="poster" src="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path}" srcset="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path} 1x, https://www.themoviedb.org/t/p/w440_and_h660_face${response.poster_path} 2x" alt="늙은 아빠들">
        </div>
    </div>
    `);

    $('.image_content').html(`
    <img class="poster lazyload lazyloaded"
    src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path}"
    data-src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path}"
    data-srcset="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2${response.poster_path} 2x"
    alt="${response.title}"
    srcset="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${response.poster_path} 1x, https://www.themoviedb.org/t/p/w600_and_h900_bestv2${response.poster_path} 2x"
    data-loaded="true">
    `);

    $('#backgroundImage').css('background-image', `url('https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${response.backdrop_path}')`);
    getCommentList(response);
}

function getCommentList(response) {
    console.log(movieReviewArr.length);
    if (movieReviewArr.length == 0) {
        $('.original_content').html(`
        <div class="review_container zero">
            <div class="content zero">
                <p class="no_margin" dir="auto">
                ${response.title}에 관한 리뷰가 없습니다. 
                <a href="review.html?id=${response.id}">리뷰 쓰기</a>
                </p>
            </div>
        </div>
        `);
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
                <tbody id="review_list">
                </tbody>
            </table>
        </div>
        <p class="new_button"><a class="" href="review.html?id=${response.id}">리뷰 작성하기</a></p>
        `);
        movieReviewArr.forEach((doc) => {
            $('#review_list').append(`
                <tr class="open" id="${doc.id}">
                    <td class="subject">
                        <div class="post_info">
                            <div class="flex_wrapper">
                                <div class="link_wrapper">
                                    <a>${doc.review}</a>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p>${doc.date}<br> 작성자 : <span class="username"><a>${doc.userName}</a></span></p>
                    </td>
                </tr>
            `);
        });

        $(document).on('click', '.open', function (e) {
            for (let i of movieReviewArr) {
                if (i.id === e.currentTarget.id) {
                    console.log(i.isLogin);
                    if(i.isLogin && user){
                        if (user.displayName == i.userName && user.uid == i.password) {
                            location.href = `reviewEdit.html?id=${url}&review_id=${e.currentTarget.id}`;
                        }
                    } else if(i.isLogin && !user){
                            alert("로그인한 사용자가 작성한 게시물입니다");
                            return;
                    } else {
                        if (i.userName != prompt("게시물 작성 시 입력한 성함을 입력해주세요")) {
                            alert("성함이 다릅니다");
                            return;
                        }
                        if (i.password != prompt("게시물 작성 시 입력한 비밀번호를 입력해주세요")) {
                            alert("비밀번호가 다릅니다");
                            return;
                        }
                    }
                }
            }
            location.href = `reviewEdit.html?id=${url}&review_id=${e.currentTarget.id}`;
        });
    }
}

//배경 이미지 가져오기
//포스터 가져오기
const menuItems = document.querySelectorAll('.menu li');
menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        // 모든 메뉴 아이템에서 'active' 클래스 제거
        menuItems.forEach(menuItem => menuItem.classList.remove('active'));
        // 현재 클릭한 메뉴 아이템에 'active' 클래스 추가
        item.classList.add('active');

        // 현재 메뉴 아이템의 ID 가져오기
        const liId = item.querySelector('a').id;
        const mediaScroller = document.getElementById('media_scroller');

        if (liId === 'popular') {
            // 'popular' 메뉴를 클릭한 경우 API를 호출하여 데이터 가져오기
            fetch(`https://api.themoviedb.org/3/movie/${url}?append_to_response=credits&language=ko-kr`, options)
                .then(response => response.json())
                .then(response => {
                    // 가져온 데이터를 페이지에 표시
                    mediaScroller.innerHTML = `
                        <div class="h_scroller content scroller" id="movie_images">
                            <div class="backdrop">
                                <img loading="lazy" class="backdrop" src="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${response.backdrop_path}" srcset="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${response.backdrop_path} 1x, https://www.themoviedb.org/t/p/w1066_and_h600_bestv2${response.backdrop_path} 2x" alt="${response.name}">
                            </div>
                            <div class="poster">
                                <img class="poster" src="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path}" srcset="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path} 1x, https://www.themoviedb.org/t/p/w440_and_h660_face${response.poster_path} 2x" alt="${response.title}">
                            </div>
                        </div>
                    `;
                })
                .catch(err => console.error(err));
        } else if (liId === 'videos') {
            // 'videos' 메뉴를 클릭한 경우 비디오 목록 가져오기
            mediaScroller.innerHTML = '<div class="h_scroller content scroller" id="video_list"></div>';
            fetch(`https://api.themoviedb.org/3/movie/${url}/videos?language=en-US`, options)
                .then(response => response.json())
                .then(response => {
                    const videoList = document.getElementById("video_list");
                    response.results.forEach(e => {
                        videoList.innerHTML += `
                            <div class="video card no_border">
                                <div class="wrapper" style="background-image: url('https://i.ytimg.com/vi/${e.key}/hqdefault.jpg');">
                                    <a class="no_click play_trailer" data-site="YouTube" data-id="${e.key}" data-title="Русский трейлер">
                                        <div class="play_background">
                                            <span class="glyphicons_v2 play invert svg"></span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        `;
                    });
                })
                .catch(err => console.error(err));
            
            // 비디오 목록의 항목을 클릭했을 때 팝업을 생성
            videoList.addEventListener('click', function (e) {
                e.preventDefault();
                const id = e.target.getAttribute('data-id');
                const title = e.target.getAttribute('data-title');
                document.body.insertAdjacentHTML('beforeend', `
                    <div class="k-overlay" style="display: block; z-index: 10003; opacity: 0.5;"></div>
                    <div class="k-widget k-window k-display-inline-flex k-state-focused" tabindex="0" style="min-width: 90px; min-height: 50px; width: 789px; height: 506px; display: none; top: 7.5px; left: 143.5px; background-color: rgb(0, 0, 0); border-color: rgb(0, 0, 0); position: fixed; z-index: 10004; opacity: 1;">
                        <div class="k-window-titlebar" style="background-color: rgb(0, 0, 0); border-color: rgb(0, 0, 0); color: rgb(255, 255, 255);">
                            <span class="k-window-title" id="video_popup_wnd_title">${title}</span>
                            <div class="k-window-actions">
                                <a role="button" href="#" class="k-button k-flat k-button-icon k-window-action" aria-label="Close">
                                    <span class="k-icon k-i-close"></span>
                                </a>
                            </div>
                        </div>
                        <div id="video_popup" data-role="window" class="k-window-content" role="dialog" aria-labelledby="video_popup_wnd_title" style="display: block; padding: 0px; margin: 0px; background-color: rgb(0, 0, 0);">
                            <title>Play NjbizH7cx5k on YouTube</title>
                            <meta charset="utf-8">
                            <style>
                                body.trailer_iframe { background-color: #000; padding: 0; margin: 0; overflow: hidden; }
                                iframe { background-color: #000; overflow: hidden; }
                            </style>
                            <iframe type="text/html" style="background-color: #000;" width="789" height="443" src="//www.youtube.com/embed/${id}?autoplay=1&amp;origin=https%3A%2F%2Fwww.themoviedb.org&amp;hl=ko&amp;modestbranding=1&amp;fs=1&amp;autohide=1" frameborder="0" allowfullscreen=""></iframe>
                        </div>
                    </div>
                `);
                
                // 팝업에서 닫기 버튼을 클릭했을 때 팝업 닫기
                const closeButton = document.querySelector('a[aria-label="Close"]');
                closeButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    const kOverlay = document.querySelector('.k-overlay');
                    const kWidget = document.querySelector('.k-widget');
                    kOverlay.remove();
                    kWidget.remove();
                });
            });
        } else if (liId === 'backdrops') {
            // 'backdrops' 메뉴를 클릭한 경우 이미지 가져오기
            mediaScroller.innerHTML = '<div class="h_scroller content scroller" id="video_list"></div>';
            fetch(`https://api.themoviedb.org/3/movie/${url}/images`, options)
                .then(response => response.json())
                .then(response => {
                    const videoList = document.getElementById("video_list");
                    response.backdrops.forEach(e => {
                        videoList.innerHTML += `
                            <div class="backdrop">
                                <img loading="lazy" class="backdrop" src="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${e.file_path}" srcset="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${e.file_path} 1x, https://www.themoviedb.org/t/p/w1066_and_h600_bestv2${e.file_path} 2x" alt="쏘우 10">
                            </div>
                        `;
                    });
                })
                .catch(err => console.error(err));
        } else if (liId === 'posters') {
            // 'posters' 메뉴를 클릭한 경우 포스터 이미지 가져오기
            $('#media_scroller').html(` <div class="h_scroller content scroller" id="video_list"></div>`)
            fetch(`https://api.themoviedb.org/3/movie/${url}/images`, options)
                .then(response => response.json())
                .then(response =>
                    response.posters.forEach(e => {
                        $('#video_list').append(`
                            <div class="backdrop">
                                <img loading="lazy" class="backdrop" src="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${e.file_path}" srcset="https://www.themoviedb.org/t/p/w533_and_h300_bestv2${e.file_path} 1x, https://www.themoviedb.org/t/p/w1066_and_h600_bestv2${e.file_path} 2x" alt="쏘우 10">
                            </div>
                        `);
                    })
                )
                .catch(err => console.error(err));
        }
    });
});

// 검색 입력란 처리
const searchInput = document.getElementById('search_input');
searchInput.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        location.href = `index.html?searchWord=${searchInput.value}`;
    }
});

// 검색 버튼 클릭 처리
const searchClick = document.getElementById('searchClick');
searchClick.addEventListener('click', function (e) {
    location.href = `index.html?searchWord=${searchInput.value}`;
});
