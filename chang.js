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

docs.forEach((doc) => {
    let row = doc.data();
    // console.log(row);
});

const click_log_out_btn = document.getElementById("log_out");//index페이지의 "로그아웃" 버튼 
const click_move_log_join = document.getElementById("log_join");// index페이지의 "로그인" 버튼
const click_log_in = document.getElementById("log_in_button");//log_join페이지의 "로그인" 버튼
const click_log_join = document.getElementById("join_mem");//log_join페이지의 "회원가입" 버튼
const back_log_in_btn = document.getElementById("back_log_in");//log_join페이지의 "로그인 하러가기" 버튼
const click_go_join_mem_btn = document.getElementById("go_join_mem");
const click_move_movie=document.getElementById("log_in_user");

try {//index페이지
    if (JSON.parse(localStorage.getItem('login_user')) != null) {
        document.getElementById("log_in_user").innerHTML = JSON.parse(localStorage.getItem('login_user'))["name"];
        click_move_movie.onclick=function(){ movie_game()};//로그인 했을때만 이동
        click_move_log_join.style.display = "none";//로그인 버튼 사라짐
        click_log_out_btn.style.display = "block";//로그아웃 버튼 생김
    }
    else {
        click_move_log_join.style.display = "block";//로그인 버튼 생김
        click_log_out_btn.style.display = "none";//로그아웃 버튼 사라짐
    }

    click_move_log_join.onclick = function () { event_click_L_J() }; //페이지 이동
    click_log_out_btn.onclick = function () { log_out() };
}
catch {//log_join페이지
    
    click_log_in.onclick = function () { log_in() }; //로그인
    click_go_join_mem_btn.onclick = function () { go_join_mem() };
    click_log_join.onclick = function () { join_mem() };//회원가입
    back_log_in_btn.onclick = function () { back_log_in() }
}

function join_mem() {//회원가입



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

function go_join_mem() {
    document.querySelector(".log_in_patent").style.display = "none";
    document.querySelector(".join_mem_parent").style.display = "block";
    document.querySelector(".J_mem").style.display = "block";
    document.querySelector(".G_J_mem").style.display = "none";
    back_log_in_btn.style.display = "block";

}
function name_check() {//이름 유효성검사
    let check = false;
    var all_S_character = /[~!@#\#$%<>^&*]/; //특수문자
    let name_val = document.getElementById("join_mem_name_value").value;//생성할 이름값 
   
    if ((name_val.length < 7 && name_val.length > 1 ) && !(all_S_character.test(name_val))) {
        //길이 제한 + !특수문자
        check = true;
    }
    else {
        alert("이름은 2~6자 이하이고 특수문자를 사용할수 없습니다.")
        return false;
    } 
    return check;
}

function id_check() {//id 유효성 검사
    let check = false;
    var all_number = /[0-9]/; //숫자
    var all_english = /[a-zA-Z]/; //영어
    var all_korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글
    let id_val = document.getElementById("join_mem_id_value").value;//생성할 id값 
    console.log(id_val);
    
    if ((4 < id_val.length && id_val.length < 31) && !(all_korean.test(id_val) && (all_english.test(id_val) && all_number.test(id_val)))) {
        //길이제한 + !(한글)+ (영어나 숫자) 전부 만족
        console.log(id_val.length);
        check = true;
    }
    else {
        alert("id는 5자이상30자 이하이고 한글을 사용할수 없습니다");
        return false;
    } 
    //사용할수 없는 id인 경우 아래는 실행하지 않음
    docs.forEach((doc) => {
        let row = doc.data();
        if (id_val == row["user_d"]["id"]) {
            alert("이미 존재하는 아이디 입니다");
            check = false;
        }
    });

    return check;
}

function password_check() {//password 유효성 검사
    var all_korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글
    let password_val = document.getElementById("join_mem_password_value").value;//생성할 password 값 
    if (password_val.length < 31 && password_val.length > 6 && !(all_korean.test(password_val))) {
        return true;
    }
    else {
        alert("비밀번호는 7~30자 이하에 한글을 사용할 수 없습니다")
        return false;
    }   
}

function log_in() {//로그인 
    //firebase에서 유저데이터를 가져옴
    let log_id_val = document.getElementById("id_value").value;//로그인 할 아이디값
    let log_password_val = document.getElementById("password_value").value;//로그인 할 비밀번호값
    let log=false;
    docs.forEach((doc) => {
        let row = doc.data();
        if (log_id_val == row["user_d"]["id"] && log_password_val == row["user_d"]["password"]) {
            localStorage.setItem("login_user", JSON.stringify(row["user_d"]))
            log =true;
            return_main_page();
        }
    });

if(!log){
    alert("아이디 또는 비밀번호가 잘못되었습니다.");
}  

    return false;//로그인 실패

}
function back_log_in() {//log_join.html페이지에서 로그인하기 눌렀을 때
    document.querySelector(".log_in_patent").style.display = "block";
    document.querySelector(".join_mem_parent").style.display = "none";
    document.querySelector(".J_mem").style.display = "none";
    document.querySelector(".G_J_mem").style.display = "block";
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

function log_out() {//로그아웃 버튼 눌렀을 때
   // console.log(localStorage.getItem("login_user"));
    localStorage.removeItem("login_user");
  //  console.log(localStorage.getItem("login_user"));
    window.location.reload();
}
//join_mem();
function movie_game() {
    location.href = "chang_game.html";
}
