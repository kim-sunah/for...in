const userSession = sessionStorage.getItem('userData');
const user = JSON.parse(userSession);
const _REVIEW = "review"
let reviewArr = [];
if (JSON.parse(localStorage.getItem(_REVIEW))) {
    reviewArr = JSON.parse(localStorage.getItem(_REVIEW));;
}
const url = new URL(document.location.href).searchParams.get('id');
const review_id = new URL(document.location.href).searchParams.get('review_id');

let review = null;

for (let i of reviewArr) {
    if (i.id === review_id) {
        review = i
        break;
    }
}

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
        templet(response)
    )
    .catch(err => console.error(err));

function templet(response) {
    $('.col1').append(`
        <a href="detail.html?id=${response.id}">
            <img class="poster" src="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path}" srcset="https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path} 1x, https://www.themoviedb.org/t/p/w440_and_h660_face${response.poster_path} 2x" alt="쏘우 10">
        </a>
    `)
    $('#text').append(`
    <h2 class="space">A review by ${user.displayName}</h2>
        <h3>Title: <span>${response.title} (${response.release_date.slice(0, 4)})</span></h3>
        <div id="editor-textarea" class="column">
            <div class="editor">
                <textarea>${review.review.replace(/<br>/g, '\n')}</textarea>
            </div>
        </div>
    `)
    $('.cancle').attr('href', `detail.html?id=${url}`)
}

$('#edit').on('click', async (e) => {
    e.preventDefault();
    let review_text = $('textarea').val();
    review_text = review_text.replace(/\n/g, '<br>');

    for (let i of reviewArr) {
        if (i.id === review_id) {
            i.review = review_text;
            break;
        }
    }
    localStorage.setItem(_REVIEW, JSON.stringify(reviewArr));
    alert("수정완료");
    location.href = `detail.html?id=${url}`;
})

$('.delete').on('click', async (e) => {
    e.preventDefault();
    if (confirm('정말로 삭제하시겠습니까?')) {
        for (let i = 0; i < reviewArr.length; i++) {
            if (reviewArr[i].id === review_id) {
                reviewArr.splice(i, 1);
                break;
            }
        }
        localStorage.setItem(_REVIEW, JSON.stringify(reviewArr));
        alert('삭제 완료!');
        location.href = `detail.html?id=${url}`;
    }
})
