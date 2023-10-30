const userSession = sessionStorage.getItem('userData');
const user = JSON.parse(userSession);
const _REVIEW = "review"
let reviewArr = [];
if (JSON.parse(localStorage.getItem(_REVIEW))) {
    reviewArr = JSON.parse(localStorage.getItem(_REVIEW));;
}
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
        templet(response)
    )
    .catch(err => console.error(err));

function guid() {
    function _s4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + _s4() + _s4();
}


let today = new Date();
let year = today.getFullYear();
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let day = ('0' + today.getDate()).slice(-2);
let hours = ('0' + today.getHours()).slice(-2);
let minutes = ('0' + today.getMinutes()).slice(-2);
let seconds = ('0' + today.getSeconds()).slice(-2);

let dateString = year + '-' + month + '-' + day + " " + hours + ':' + minutes + ':' + seconds;;
function templet(response) {
    console.log(response);
    var col1 = document.querySelector('.col1');
    col1.innerHTML = '<a href="detail.html?id=' + response.id + '">' +
        '<img class="poster" src="https://www.themoviedb.org/t/p/w220_and_h330_face' + response.poster_path + '" ' +
        'srcset="https://www.themoviedb.org/t/p/w220_and_h330_face' + response.poster_path + ' 1x, ' +
        'https://www.themoviedb.org/t/p/w440_and_h660_face' + response.poster_path + ' 2x" alt="쏘우 10">' +
        '</a>';

    var text = document.getElementById('text');
    text.innerHTML = '<h2 class="space">A review by ' + (userSession ? user.displayName : 'you') + '</h2>' +
        '<h3>Title: <span>' + response.title + ' (' + response.release_date.slice(0, 4) + ')</span></h3>' +
        '<div id="editor-textarea" class="column">' +
        '<div class="editor">' +
        '<textarea placeholder="You can start writing your review here."></textarea>' +
        '</div>' +
        '</div>';

    var cancelButton = document.querySelector('.cancle');
    var url = new URL(document.location.href).searchParams.get('id');
    cancelButton.href = 'detail.html?id=' + url;
}


const reviewForm = document.getElementById('review');

reviewForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addComment();
});


async function addComment() {

    let textarea = document.querySelector('textarea');
    let review = textarea.value;
    review = review.replace(/\n/g, '<br>');
    let password = null;
    let name = null
    let isLogin = false
    if ($('textarea').val() == "") {
        alert('댓글이 입력되지 않았습니다.')
        return
    }
    if (userSession == null) {
        name = prompt("성함을 알려주세요~");
        console.log(name)
        if (name == null) return;
        password = prompt("게시글의 비밀번호를 입력해주세요");
        if (password == null) return;
    } else {
        name = user.displayName;
        password = user.uid;
        isLogin = true
    }
    let doc = {
        'id': guid(), // UUID 생성
        'userName': name,
        'review': review,
        'password': password,
        'date': dateString,
        'movieId': url,
        "isLogin": isLogin
    }
    alert('저장 완료!');
    reviewArr.push(doc)
    localStorage.setItem(_REVIEW, JSON.stringify(reviewArr));
    location.href = `detail.html?id=${url}`;
}