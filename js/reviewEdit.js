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
console.log(typeof review_id)
console.log(review_id)

for (let i of reviewArr) {
    console.log(typeof i.id)
    if (i.id === review_id) {
        review = i
        break;
    }
}
console.log(review)

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
        console.log(review);
        const col1 = document.querySelector('.col1');
    
        // Create an 'a' element for the poster
        const posterLink = document.createElement('a');
        posterLink.href = `detail.html?id=${response.id}`;
    
        // Create an 'img' element for the poster
        const posterImage = document.createElement('img');
        posterImage.className = 'poster';
        posterImage.src = `https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path}`;
        posterImage.srcset = `https://www.themoviedb.org/t/p/w220_and_h330_face${response.poster_path} 1x, https://www.themoviedb.org/t/p/w440_and_h660_face${response.poster_path} 2x`;
    
        // Append the 'img' element to the 'a' element
        posterLink.appendChild(posterImage);
    
        // Append the 'a' element to the 'col1' element
        col1.appendChild(posterLink);
    
        const text = document.querySelector('#text');
        console.log(review.review)
        text.innerHTML = `
            <h2 class="space">A review by ${review.id}</h2>
            <h3>Title: <span>${response.title} (${response.release_date.slice(0, 4)})</span></h3>
            <div id="editor-textarea" class="column">
                <div class="editor">
                    <textarea>${review.review.replace(/<br>/g, '\n')}</textarea>
                </div>
            </div>
        `;
    
        const cancle = document.querySelector('.cancle');
        cancle.setAttribute('href', `detail.html?id=${url}`);
    }
    
    document.querySelector('#edit').addEventListener('click', (e) => {
        e.preventDefault();
        const review_text = document.querySelector('textarea').value;
        const review_text_updated = review_text.replace(/\n/g, '<br>');
    
        for (let i of reviewArr) {
            if (i.id === review_id) {
                i.review = review_text_updated;
                break;
            }
        }
    
        localStorage.setItem(_REVIEW, JSON.stringify(reviewArr));
        alert("수정완료");
        location.href = `detail.html?id=${url}`;
    });
    
    document.querySelectorAll('.delete').forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', (e) => {
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
        });
    });
    