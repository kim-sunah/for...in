//      node chang.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC8f1aROd-xxbOKnXL6VtedVfmt7aVKRd4",
    authDomain: "ptsd33-29444.firebaseapp.com",
    projectId: "ptsd33-29444",
    storageBucket: "ptsd33-29444.appspot.com",
    messagingSenderId: "241634528324",
    appId: "1:241634528324:web:daf79c70bafe8d8ee9c011",
    measurementId: "G-V9ZE8ES71P"
};
// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const user = {
    name: "",
    id: "",
    password: ""
}

let copy_user = [];
let num = 1;

let docs = await getDocs(collection(db, "users"));

//let on_docs = await getDocs(collection(db, "on_user"));
docs.forEach((doc) => {
    let row = doc.data();
    console.log(row);
});

/*
const fetchUsers = async () => {
    // ... try, catch 생략
    const usersCollectionRef = collection(db, 'users'); // 참조
    const userSnap = await getDocs(usersCollectionRef); // 데이터 스냅 받아오기 - 비동기처리
    const data = userSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
return data;
}
let a=fetchUsers();
console.log(a);
//console.log(collection(db, "on_user"));
 /* if(row["on_user_d"]["user_d"]["name"].length){
        console.log("있음");
    }
    else console.log("없음");*/

const click_log_out_btn = document.getElementById("log_out");//index페이지의 "로그아웃" 버튼 
const click_move_log_join = document.getElementById("log_join");// index페이지의 "로그인" 버튼
const click_log_in = document.getElementById("log_in_button");//log_join페이지의 "로그인" 버튼
const click_log_join = document.getElementById("join_mem");//log_join페이지의 "회원가입" 버튼
const back_log_in_btn = document.getElementById("back_log_in");//log_join페이지의 "로그인 하러가기" 버튼
/*
on_docs.forEach((doc)=>{
    let row =doc.data();
    try{//로그인한 유저가 있으면
        console.log(row["on_user_d"]["user_d"]["name"].length);
        document.getElementById("log_in_user").innerHTML=row["on_user_d"]["user_d"]["name"];
        click_move_log_join.style.display="none";//로그인 버튼 사라짐
        click_log_out_btn.style.display="block";//로그아웃 버튼 사라짐
    }
   catch{//로그인한 유저가 없으면 
    console.log("없음");    
    click_move_log_join.style.display="block";//로그인 버튼 생김
    click_log_out_btn.style.display="none";//로그아웃 버튼 생김
   }
})*/

//back_log_in_btn.style.display="none";


try {
    if (JSON.parse(localStorage.getItem('login_user')) != null) {
        console.log("로그인유저이씅ㅁ");
        document.getElementById("log_in_user").innerHTML = JSON.parse(localStorage.getItem('login_user'))["name"];
        click_move_log_join.style.display = "none";//로그인 버튼 사라짐
        click_log_out_btn.style.display = "block";//로그아웃 버튼 생김
    }
    else {
        console.log("로그인유저없음");
        click_move_log_join.style.display = "block";//로그인 버튼 생김
        click_log_out_btn.style.display = "none";//로그아웃 버튼 사라짐
    }
    click_move_log_join.onclick = function () { event_click_L_J() }; //페이지 이동
    click_log_out_btn.onclick = function () { log_out() };
}
catch {
    click_log_in.onclick = function () { log_in() }; //로그인
    click_log_join.onclick = function () { join_mem() };//회원가입

}

function join_mem() {//회원가입
    document.querySelector(".log_in_patent").style.display = "none";
    document.querySelector(".join_mem_parent").style.display = "block";
    back_log_in_btn.style.display = "block";
    back_log_in_btn.onclick = function () { back_log_in() }
    let name_val = document.getElementById("join_mem_name_value").value;//생성할 이름값 
    let id_val = document.getElementById("join_mem_id_value").value;//생성할 id값 
    let password_val = document.getElementById("join_mem_password_value").value;//생성할 password 값 
    copy_user[num] = Object.assign({}, user);//새로 만들 유저 
    // console.log(name_check());
    //   console.log(id_check());
    // console.log(password_check());
    if (name_check() + id_check() + password_check() == 3) { //검사 결과가 모두 참 일 떄
        console.log("성공");
        copy_user[num].name = name_val;
        copy_user[num].id = id_val;
        copy_user[num].password = password_val;
        num++;
        back_log_in();//회원 가입 화면에서 로그인 화면으로 넘어감
        data_fire_base();
    }
    else {
        console.log("n");
    }
}

function name_check() {//이름 유효성검사
    let check = false;
    var all_S_character = /[~!@#\#$%<>^&*]/; //특수문자
    let name_val = document.getElementById("join_mem_name_value").value;//생성할 이름값 
    if (name_val.length < 7 && name_val.length > 1 && !(all_S_character.test(name_val))) {
        //길이 제한 + !특수문자
        check = true;
    }
    else {
        return false;
    }  //  console.log("이름은 2글자에서 6글자 사이로 해야 합니다")
    //사용할수 없는 이름인 경우 아래는 실행하지 않음
    docs.forEach((doc) => {
        let row = doc.data();
        if (name_val == row["user_d"]["name"]) {
            console.log("실패");
            check = false;

        }
    });
    /*
        for (let i = 1; i < num; i++) {//원래 있는 이름인지 확인
            if (name_val == copy_user[i].name) {
                // console.log("이름이 같음");
                return false;
            }
        }*/
    // console.log("사용할 수 있는 이름");
    return check;
}

function id_check() {//id 유효성 검사
    let check = false;
    var all_number = /[0-9]/; //숫자
    var all_english = /[a-zA-Z]/; //영어
    var all_korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글
    var all_S_character = /[~!@#\#$%<>^&*]/; //특수문자
    let id_val = document.getElementById("join_mem_id_value").value;//생성할 id값 
    if (5 < id_val.length && id_val.length < 31 && !(all_korean.test(id_val) || all_S_character.test(id_val)) && (all_english.test(id_val) && all_number.test(id_val))) {
        //길이제한 + !(한글이나 특수문자)+ (영어나 숫자) 전부 만족
        check = true;
    }
    else {
        return false;
    }  //  console.log("id은 6글자에서 30글자 사이로 해야 합니다")
    //사용할수 없는 id인 경우 아래는 실행하지 않음
    docs.forEach((doc) => {
        let row = doc.data();
        if (id_val == row["user_d"]["id"]) {
            console.log("실패");
            check = false;

        }
    });
    /*
        for (let i = 1; i < num; i++) {
            if (id_val == copy_user[i].id) {
                //  console.log("id가 같음");
                return false;
            }
        }*/
    //console.log("사용할 수 있는 id");
    return check;
}

function password_check() {//password 유효성 검사
    var all_korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글
    let password_val = document.getElementById("join_mem_password_value").value;//생성할 password 값 
    if (password_val.length < 31 && password_val.length > 6 && !(all_korean.test(password_val))) {
        //길이제한+ !한글
        return true;
    }
    else return false;  //  console.log("password은 7글자에서 30글자 사이로 해야 합니다")
    //사용할수 없는 id인 경우 아래는 실행하지 않음
}

function log_in() {//로그인 
    //firebase에서 유저데이터를 가져옴
    let log_id_val = document.getElementById("id_value").value;//로그인 할 아이디값
    let log_password_val = document.getElementById("password_value").value;//로그인 할 비밀번호값

    docs.forEach((doc) => {
        let row = doc.data();
        if (log_id_val == row["user_d"]["id"] && log_password_val == row["user_d"]["password"]) {

            //  console.log(row["user_d"]);
            localStorage.setItem(//local에 로그인한 유저
                "login_user", JSON.stringify(row["user_d"]))
            console.log(JSON.parse(localStorage.getItem('login_user')));
            //   online_user(row);
            return_main_page();
        }
    });
    /*
    for (let i = 1; i < num; i++) {
        if (log_id_val == copy_user[i].id && log_password_val == copy_user[i].password) {

            online_user(i);
            return_main_page();
        }
    }*/
    return false;//로그인 실패

}
function back_log_in() {//log_join.html페이지에서 로그인하기 눌렀을 때
    document.querySelector(".log_in_patent").style.display = "block";
    document.querySelector(".join_mem_parent").style.display = "none";
    back_log_in_btn.style.display = "none";
}

function event_click_L_J() {//log_join.html 페이지 이동 

    location.href = "log_join.html";
}

function return_main_page() {//index.html페이지로 이동  
    location.href = "index.html";
}
let data_fire_base = async function () {//회원가입으로 유저정보 저장

    let user_data = { "user_d": copy_user[num - 1] };//num-1을 하는 이유는 위에서 num++를 했기때문
    await addDoc(collection(db, "users"), user_data);
}
/*
 async  function online_user (row) {
    let on_user_data={"on_user_d": row }
    await addDoc(collection(db,"on_user"),on_user_data)
}
*/
function log_out() {//로그아웃 버튼 눌렀을 때
    console.log(localStorage.getItem("login_user"));
    localStorage.removeItem("login_user");
    console.log(localStorage.getItem("login_user"));
    window.location.reload();
}

function movie_poster_merge(){
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMDVjYzE4YTk5Y2U4MTc1Y2I4YTI2YjRmMzhkNjkxMCIsInN1YiI6IjY1MmY0OWU4MDI0ZWM4MDEwMTU0MTkyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fn5pNmujTnJOpP-y8uUDOYk0DX44yKCTXfaPIpm3a1M'
        }
    };
    for(let j=1;j<6;j++){
        fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${j}`, options)
            .then(async (response) =>
                await response.json()).then(val => {
                //val["results"][0]["poster_path"]
                val["results"].forEach(element=>{
                    let movie_poster = document.createElement("span");//
                    document.getElementById("logjoin_page").appendChild(movie_poster);//위에서 생성한 태그를 card의 자식으로 선언
                let post=`<img src="https://image.tmdb.org/t/p/w300${element["poster_path"]}" alt="...">`;
                movie_poster.innerHTML=post;
                })
               
        }
                )
            .catch(err => console.error(err));
    }
}
//join_mem();
movie_poster_merge();

