import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDVFBpY6xUuy-h2PRgyYKyHI8McD6dXw-M",
    authDomain: "drawncollab.firebaseapp.com",
    projectId: "drawncollab",
    storageBucket: "drawncollab.appspot.com",
    messagingSenderId: "234353709129",
    appId: "1:234353709129:web:2427d1b819fcd0f69fef98",
    measurementId: "G-N8Z9MKR99R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then(async (result) => {
        const email = result.user.email;

        const data = {
            "email": email
        }

        await axios.post("/login/google", data);
        window.location.replace("http://localhost:3000/draw");
    }).catch(err => {
        console.log(err);
    });
}

const googleLogin = document.getElementById("google-login");
googleLogin.addEventListener("click", () => {
    signInWithGoogle();
});