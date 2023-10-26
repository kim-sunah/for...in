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
    console.log(response)
    $('.col1').append(`
        <a href="detail.html?id=${response.id}">
            <img class="poster" src="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path}" srcset="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path} 1x, https://www.themoviedb.org/t/p/w440_and_h660_face${response.poster_path} 2x" alt="쏘우 10">
        </a>
    `)
    $('#text').append(`
        <h2 class="space">A review by 유저이름</h2>
        <h3>Title: <span>${response.title} (${response.release_date.slice(0, 4)})</span></h3>
        <div id="editor-textarea" class="column">
            <div class="editor">
                <textarea placeholder="You can start writing your review here."></textarea>
            </div>
        </div>
    `)
    $('.cancle').attr('href', `detail.html?id=${url}`)
}

$('#review').on('submit', (enent) => {
    enent.preventDefault();
    addComment()
})

async function addComment() {
    let review = $('textarea').val();
    review = review.replace(/\n/g, '<br>');
    let name = localStorage.getItem('userName')
    if ($('textarea').val() == "") {
        alert('댓글이 입력되지 않았습니다.')
        return
    } else if (name == undefined) {
        name = prompt("성함을 알려주세요~");
        if (name == "") return;
        else localStorage.setItem('userName', name);
    }
    let password = prompt("게시글의 비밀번호를 입력해주세요");
    if (password) {
        let doc = {
            'id': guid(), // UUID 생성
            'userName': localStorage.getItem('userName'),
            'review': review,
            'password': password,
            'date': dateString,
        }
        alert('저장 완료!');
        reviewArr.push(doc)
        localStorage.setItem(_REVIEW, JSON.stringify(reviewArr));
        location.href = `detail.html?id=${url}`;
    }
}