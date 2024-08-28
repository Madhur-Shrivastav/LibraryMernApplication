import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log(data);
      dispatch(signInSuccess(data));
      navigate("/profile");
    } catch (error) {
      console.log("Couldn't signin with Google", error.message);
    }
  };
  return (
    <button
      className=" text-yellow-500 border border-yellow-500 p-3 rounded-lg uppercase hover:opacity-[95%]"
      type="button"
      onClick={handleGoogleClick}
    >
      Continue With Google
    </button>
  );
};

export default OAuth;
