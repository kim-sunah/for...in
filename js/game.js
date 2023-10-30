const userSession = sessionStorage.getItem('userData');
const user = JSON.parse(userSession);

//document.getElementById("L_movie").id//만일 오류가 날경우 이 아랫줄을 지우길 바람
document.getElementById("user_name").innerHTML = user.displayName + "님의";
document.getElementById("b_score").innerHTML = "최고 점수 : " + user.gameStore;;
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMDVjYzE4YTk5Y2U4MTc1Y2I4YTI2YjRmMzhkNjkxMCIsInN1YiI6IjY1MmY0OWU4MDI0ZWM4MDEwMTU0MTkyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fn5pNmujTnJOpP-y8uUDOYk0DX44yKCTXfaPIpm3a1M'
    }
};
let page_num = 1;//페이지
let post_num = 0;
let equir = false;
let left_movie_num = rand(0, 99);
let right_movie_num = rand(0, 99);
let score = 0;
//  let best_score = 0;
//
while (!equir) {//좌우가 같은지 확인
    if (right_movie_num == left_movie_num) {//같으면 새롭게 생성
        right_movie_num = rand(0, 99);
        equir = false;
    }
    else {
        equir = true;
    }
}
page_num = Math.floor(1 + left_movie_num / 20);
post_num = left_movie_num % 20;
fetch_data(page_num, post_num, "L_movie");

page_num = Math.floor(1 + right_movie_num / 20);
post_num = right_movie_num % 20;
fetch_data(page_num, post_num, "R_movie");


function rand(min, max) {//랜덤 수를 얻는 함수
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fetch_data(i, num, lr) {
    fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${i}`, options)
        .then(async (response) =>
            await response.json()).then(val => {
                f = val["results"][num];
                make_post(f, lr);
                return f;
            }
            )
        .catch(err => console.error(err));
}
function make_post(post, lr) {//lr 은 왼쪽 오른쪽

    let movie_poster = `
            <span id="${lr}_child">
            <img src="https://image.tmdb.org/t/p/w500${post["backdrop_path"]}" alt="..."> 
            <span class="movie_card_title">  <h2>${post["title"]}</h2></span>
            <span>투표수</span>
            <span id="${lr}_vote_count"> ${post["vote_count"]}</span>
            </span>
            `;
    document.getElementById(`${lr}`).innerHTML = movie_poster;
    if (lr == "L_movie") {
        document.getElementById(`${lr}_vote_count`).style.display = "block";
    }
    else {
        document.getElementById(`${lr}_vote_count`).style.display = "none";
    }

}
//화살표 눌럿을때 함수

function click_up() {//높다
    let l_m = document.getElementById("L_movie");
    let r_m = document.getElementById("R_movie");
    let L_pop = document.getElementById("L_movie_vote_count");
    let R_pop = document.getElementById("R_movie_vote_count");
    R_pop.style.display = "block";
    setTimeout(function () {
        if (Number(L_pop.innerText) < Number(R_pop.innerText)) {//정답
            let clone_m = document.getElementById("R_movie_child");
            let fe = clone_m.cloneNode(true); //노드 복사 
            left_movie_num = right_movie_num;
            fe.setAttribute("id", "L_movie_child")
            fe.lastChild.previousSibling.setAttribute("id", "L_movie_vote_count");
            //  console.log(fe.lastChild.previousSibling.id);
            l_m.replaceChildren(l_m.appendChild(fe));
            right_movie_num = rand(0, 99);
            equir = false;
            while (!equir) {//좌우가 같은지 확인
                if (right_movie_num == left_movie_num) {//같으면 새롭게 생성
                    right_movie_num = rand(0, 99);
                    equir = false;
                }
                else {
                    equir = true;
                }
            }
            page_num = Math.floor(1 + right_movie_num / 20);
            post_num = right_movie_num % 20;
            r_m.replaceChildren();
            fetch_data(page_num, post_num, "R_movie");
            score++;
        }
        else {
            alert("틀렸습니다.");
            score = 0;
            window.location.reload();
        }
        if (user.gameStore < score) {
            user.gameStore = score;
            sessionStorage.setItem('gameStore', score);
            const updatedUserSession = JSON.stringify(user);
            sessionStorage.setItem('userData', updatedUserSession);
        }
        document.getElementById("score").innerHTML = "점수 : " + score;
        document.getElementById("b_score").innerHTML = "최고 점수 : " + user.gameStore;


    }, 600);

}
function click_down() {
    let l_m = document.getElementById("L_movie");
    let r_m = document.getElementById("R_movie");
    let L_pop = document.getElementById("L_movie_vote_count");
    let R_pop = document.getElementById("R_movie_vote_count");
    R_pop.style.display = "block";
    setTimeout(function () {
        if (Number(L_pop.innerText) > Number(R_pop.innerText)) {//정답
            let clone_m = document.getElementById("R_movie_child");
            let fe = clone_m.cloneNode(true);
            left_movie_num = right_movie_num;
            fe.setAttribute("id", "L_movie_child")
            fe.lastChild.previousSibling.setAttribute("id", "L_movie_vote_count");
            //  console.log(fe.lastChild.previousSibling.id);
            l_m.replaceChildren(l_m.appendChild(fe));
            right_movie_num = rand(0, 99);
            equir = false;
            while (!equir) {//좌우가 같은지 확인
                if (right_movie_num == left_movie_num) {//같으면 새롭게 생성
                    right_movie_num = rand(0, 99);
                    equir = false;
                }
                else {
                    equir = true;
                }
            }
            page_num = Math.floor(1 + right_movie_num / 20);
            post_num = right_movie_num % 20;
            r_m.replaceChildren();
            fetch_data(page_num, post_num, "R_movie");

            // document.getElementById("L_movie").after(clone_m) ;
            score++;
        }
        else {
            alert("틀렸습니다.");
            score = 0;
            window.location.reload();
        }
        if (user.gameStore < score ) {
            user.gameStore = score;
            sessionStorage.setItem('gameStore', score);
            const updatedUserSession = JSON.stringify(user);
            sessionStorage.setItem('userData', updatedUserSession);
        }
        document.getElementById("score").innerHTML = "점수 : " + score;
        document.getElementById("b_score").innerHTML = "최고 점수 : " + user.gameStore;
    }, 600);
}
//정답오답 함수

function back_main() {
    location.href = "index.html";
}