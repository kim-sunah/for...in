// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Firebase 구성 정보 설정
const firebaseConfig = {
  apiKey: "AIzaSyCauRZ02WOgnWSXDX7pEVv9xJ-g25bOyWE",
  authDomain: "sparta5-65934.firebaseapp.com",
  databaseURL: "https://sparta5-65934-default-rtdb.firebaseio.com",
  projectId: "sparta5-65934",
  storageBucket: "sparta5-65934.appspot.com",
  messagingSenderId: "381298859705",
  appId: "1:381298859705:web:b65a54d74b3b7f765b8568",
  measurementId: "G-PE2KPSE1FQ"
};
// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

const cardList = document.getElementById("cardList");
const searchFrom = document.getElementById("searchFrom");
const searchInput = document.getElementById("search_input");
const movieCard = document.querySelector(".movieCard");
const search_word = new URL(document.location.href).searchParams.get('searchWord');

//우섭님꺼
const genreFilter = document.getElementById("genreFilter");
const genrecategory = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  Science_Fiction: 878,
  TV_Movie: 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};
const genreKeys = Object.keys(genrecategory);
genreKeys.forEach((genre) => {
  const option = document.createElement("option");
  option.value = genrecategory[genre];
  option.textContent = genre;
  genreFilter.appendChild(option);
});


const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzliNjIwOTFmMzY0Y2M4MzczMGExMzU3ZWM1YjE3ZCIsInN1YiI6IjY1MmY3NTcyMzU4ZGE3NWI1ZDAwODcyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j6JDptMTCwZT8Gkr2PbQ2rWV5r85H1fKNwS4iF1_o3U",
  },
};
let movieList = []

function loadData() {
  const promises = [];
  for (let i = 1; i < 6; i++) {
    const promise = fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${i}`, options)
      .then((response) => response.json())
      .then((response) => {
        response.results.forEach((element) => {
          console.log(element)
          const movie = element.original_title;
          const movieImage = element.poster_path;
          const movieOverview = element.overview;
          const movieAverage = element.vote_average;
          const movieId = element.id;
          const moviePopularity = element.popularity;
          const movieDate = element.release_date;
          const genre = element.genre_ids;
          movieList.push({
            movie,
            movieImage,
            movieOverview,
            movieAverage,
            movieId,
            moviePopularity,
            movieDate,
            genre,
          });
        });
      })
      .catch((err) => console.error(err))
    promises.push(promise);
  }
  Promise.all(promises)
    .then(() => {
      movieList.sort((a, b) => (a.movieAverage < b.movieAverage ? 1 : -1));
      search();
    });
}
window.onload = function () {
  // 로그인 상태 확인
  var userSession = sessionStorage.getItem('userData');
  var user = JSON.parse(userSession);
  if (user) {
    console.log("log in");
    // 사용자가 로그인한 경우
    var goGameLink = document.createElement('a');
    goGameLink.href = "chang_game.html";
    goGameLink.textContent = "게임하러가기";
    document.getElementById('go-game').appendChild(goGameLink);

    var isLoginDiv = document.getElementById('is_login');
    var userNameLink = document.createElement('a');
    userNameLink.className = "no_click tooltip_hover";
    userNameLink.id = "userName";
    userNameLink.title = "프로필과 설정";
    userNameLink.setAttribute('data-role', 'tooltip');
    userNameLink.textContent = user.displayName + "님 반갑습니다";
    isLoginDiv.appendChild(userNameLink);

    var logoutButton = document.createElement('button');
    logoutButton.id = "log_out";
    logoutButton.textContent = "Logout";
    isLoginDiv.appendChild(logoutButton);

    logoutButton.addEventListener('click', function () {
      signOut(auth)
        .then(function () {
          // 로그아웃 성공 시 처리
          sessionStorage.removeItem('userData');
          alert("로그아웃 성공!");
          location.reload();
        })
        .catch(function (error) {
          // 로그아웃 실패 시 처리
          alert("로그아웃 실패: " + error);
        });
    });
  } else {
    // 사용자가 로그인하지 않은 경우
    var loginButton = document.createElement('button');
    loginButton.id = 'log_join.html';
    loginButton.textContent = "Login";
    loginButton.onclick = function () {
      location.href = 'log_join.html';
    };
    document.getElementById('is_login').appendChild(loginButton);
  }

  var searchInput = document.getElementById('search_input');
  if (search_word) {
    searchInput.value = search_word;
  }

  searchInput.value = search_word != null ? search_word : null;
  loadData();
};
function sortChange(e) {
  // console.log(e.target.value);
  if (e == "lowAverage") {
    movieList.sort((a, b) => (a.movieAverage > b.movieAverage ? 1 : -1));
    return search();
  } else if (e == "highAverage") {
    movieList.sort((a, b) => (a.movieAverage < b.movieAverage ? 1 : -1));
    return search();
  } else if (e == "new") {
    movieList.sort((a, b) =>
      new Date(a.movieDate) < new Date(b.movieDate) ? 1 : -1
    );
    return search();
  } else if (e == "abc") {
    movieList.sort((a, b) => (a.movie > b.movie ? 1 : -1));
    return search();
  } else if (e == "cba") {
    movieList.sort((a, b) => (a.movie < b.movie ? 1 : -1));
    return search();
  } else if (e == "popularity") {
    movieList.sort((a, b) => (a.moviePopularity < b.moviePopularity ? 1 : -1));
    return search();
  } else {
    return movieList.sort((a, b) => (a.movieAverage < b.movieAverage ? 1 : -1));
  }
}

genreFilter.addEventListener("change", () => {
  search();
});
document.getElementById("selectSort").addEventListener("change", function (event) {
  sortChange(event.target.value);
  search();
});

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    search();
  }
});

document.getElementById("searchClick").addEventListener("click", function (event) {
  event.preventDefault();
  search();
});

function search(event) {
  if (event != null) {
    event.preventDefault();
  }
  // event.preventDefault();
  let searchWord = searchInput.value.toUpperCase()

  const searchgenre = genreFilter.value;
  cardList.innerHTML = "";
  movieList.filter((element) => {
    if (searchgenre != "장르") {
      if (
        element.movie.toUpperCase().includes(searchWord) &&
        element.genre.includes(parseInt(searchgenre))
      ) {
        return true;
      }
    } else {
      if (element.movie.toUpperCase().includes(searchWord)) {
        return true;
      }
    }
  }).map((element) => {
    cardList.innerHTML += `
            <div class = "movieCard" id = "${element.movieId}" onclick ="location.href='detail.html?id=${element.movieId}';" >
                <img class = "movieImg" src = "https://image.tmdb.org/t/p/w500/${element.movieImage}"/>
                <div class = "cardBox">
                <h3 class = "movieTitle">${element.movie}</h3>
                <p class = "movieaverage">⭐ ${element.movieAverage}</p>
                <div class = "txtBox">
                <p class = "movieTxt" >${element.movieOverview}</p>
                </div>
                </div>
            </div>`;
  });
}