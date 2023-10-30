// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

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

//Email 로그인
function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

//Email 회원가입

$(document).ready(function () {
    // Sign In form submit event
    $("#sign-in-form").submit(function (e) {
        e.preventDefault();
        console.log("eeee")
        sign_in();
    });

    // Sign Up form submit event
    $("#sign-up-form").submit(function (e) {
        e.preventDefault();
        sign_up();
    });
});

function sign_in() {
    let signIn = {
        idSignin: $("#id-signin").val(),
        passSignin: $("#pass-signin").val(),
    };
    signInWithEmailAndPassword(auth, signIn.idSignin, signIn.passSignin)
        .then((userCredential) => {
            // 로그인 성공 시 처리
            const user = userCredential.user;
            alert("로그인 성공! 사용자 ID: " + user.uid);

            const userData = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                gameStore:0,
            };

            const userDataString = JSON.stringify(userData);
            sessionStorage.setItem('userData', userDataString);
            
            location.href = "index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("로그인 실패: " + errorMessage);
        });
}

function sign_up() {
    let signUp = {
        userSignup: $("#user-signup").val(),
        idSignup: $("#id-signup").val(),
        passSignup: $("#pass-signup").val(),
        repeatPass: $('#repeat-pass').val(),
    };


    if (signUp.userSignup === '' || signUp.idSignup === '' || signUp.passSignup === '' || signUp.repeatPass === '') {
        alert("모든 항목을 입력해주세요.");
        return;
    }
    if (name_check(signUp.userSignup) + id_check(signUp.idSignup) + password_check(signUp.passSignup, signUp.repeatPass) == 3) {
        createUserWithEmailAndPassword(auth, signUp.idSignup, signUp.passSignup)
            .then((userCredential) => {
                console.log(userCredential)
                // 회원가입 성공 시 처리
                const user = userCredential.user;
                console.log(user);
                // 사용자 정보 업데이트
                
                return updateProfile(user, {
                    displayName: signUp.userSignup,
                    gameStore: "0",
                    photoURL: "https://example.com/jane-q-user/profile.jpg"
                });
            })
            .then(() => {
                alert("회원가입 성공! 로그인해주세요")
                document.getElementById("tab-1").checked = true;
                document.getElementById("tab-2").checked = false;
            })
            .catch((error) => {
                // 회원가입 실패 시 처리
                const errorMessage = error.message;
                console.error("회원가입 실패:", errorMessage);
                alert("이미 가입된 회원입니다")
                location.reload();
            });
    }
}

function name_check(name) {
    let check = true;
    let all_S_character = /[~!@#\#$%<>^&*]/; //특수문자
    console.log(name.length)
    if ((name.length > 7 && name.length < 1) && all_S_character.test(name)) {
        //길이 제한 + !특수문자
        $("#user-signup").val('');
        $('#user-signup').attr("placeholder", "이름은 2~6자 이하이고 특수문자를 사용할수 없습니다.")
        check= false
    }
    console.log(check)
    return check;
}

function id_check(id) {//id 유효성 검사
    let check = true;
    let valid_txt = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/; 

    if(valid_txt.test(id)==false){ 
		  
        $("#id-signup").val('');
        $('#id-signup').attr("placeholder", "올바른 email을 입력해주세요")
        
        check=  false;
    }
    console.log(check)
    return check;
}
function password_check(password, repeatPass) {//password 유효성 검사
    let all_korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글
    let check = true
    if(password!==repeatPass){
        $('#repeat-pass').val('');
        $('#repeat-pass').attr("placeholder", "비밀번호가 다릅니다")
        check = false
    }
    if(password.length > 31 && password.length < 6 && !(all_korean.test(password))){
        $("#pass-signup").val('');
        $('#repeat-pass').val('');
        $('#pass-signup').attr("placeholder", "비밀번호는 7~30자 이하에 한글을 사용할 수 없습니다")
        alert("비밀번호를 확인해주세요")
        check = false
    }
    return check
}

$('#search_input').on("keydown", function (event) {
    if (event.key == "Enter") {
        event.preventDefault();
        console.log(13)
        location.href = `index.html?searchWord=${$('#search_input').val()}`;
    }
});

$("#searchClick").on("click", function (e) {
    location.href = `index.html?searchWord=${$('#search_input').val()}`;
});

