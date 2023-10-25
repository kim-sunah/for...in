// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs, getDoc, deleteDoc, addDoc, collection, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { query, orderBy, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
// import { getAnalytics } from "firebase/analytics";

const _REVIEW = "review"
let reviewArr = [];
if (JSON.parse(localStorage.getItem(_REVIEW))) {
    reviewArr = JSON.parse(localStorage.getItem(_REVIEW));;
}
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
const url = new URL(document.location.href).searchParams.get('id');
const review_id = new URL(document.location.href).searchParams.get('review_id');
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



let today = new Date();
let year = today.getFullYear();
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let day = ('0' + today.getDate()).slice(-2);
let hours = ('0' + today.getHours()).slice(-2);
let minutes = ('0' + today.getMinutes()).slice(-2);
let seconds = ('0' + today.getSeconds()).slice(-2);

let dateString = year + '-' + month + '-' + day + " " + hours + ':' + minutes + ':' + seconds;;


async function getReview() {
    const docSnap = await getDoc(doc(db, url, review_id));
    let review = docSnap.data()['review']
    review = review.replace(/<br>/g, '\n');
    $('.editor textarea').attr("placeholder", review)
}

function templet(response) {
    getReview();
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
                <textarea></textarea>
            </div>
        </div>
    `)
    $('.cancle').attr('href', `detail.html?id=${url}`)
}

$('#edit').on('click', async (enent) => {
    let review_text = $('textarea').val();
    review_text = review_text.replace(/\n/g, '<br>');
    await updateDoc(doc(db, url, review_id), {
        'review': review_text
    });
    alert("수정완료")
    location.href = `detail.html?id=${url}`;
})
$('.delete').on('click', async (enent) => {
    await deleteDoc(doc(db, url, review_id));
    alert('삭제 완료!');
    location.href = `detail.html?id=${url}`;
})