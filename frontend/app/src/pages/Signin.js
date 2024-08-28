import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth.js";

const Signin = () => {
  const [formdata, setformdata] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = async (event) => {
    setformdata({
      ...formdata,
      [event.target.id]: event.target.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        alert(data.message);
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/profile");
      console.log(data);
    } catch (error) {
      dispatch(signInFailure(error.message));
      alert(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-yellow-500 text-center font-semibold my-7">
        Sign In
      </h1>
      <form
        className=" flex flex-col gap-4 p-3 bg-custom-blue rounded-lg"
        onSubmit={handleSubmit}
      >
        <label className="relative w-full my-3">
          <input
            type="text"
            id="email"
            className="block p-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer"
            onChange={handleChange}
            required
          />
          <span
            className="absolute text-white text-lg duration-300 left-2 top-2 
    peer-focus:text-sm 
    peer-focus:-translate-y-5 
    peer-focus:px-1
    peer-focus:bg-yellow-500
    peer-focus:text-custom-blue      
    peer-valid:text-sm  
    peer-valid:-translate-y-5
    peer-valid:px-1            
    peer-valid:bg-yellow-500
    peer-valid:text-custom-blue     
    "
          >
            Email
          </span>
        </label>
        <label className="relative w-full my-3">
          <input
            type="password"
            id="password"
            className="block p-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer"
            onChange={handleChange}
            required
          />
          <span
            className="absolute text-white text-lg duration-300 left-2 top-2 
    peer-focus:text-sm 
    peer-focus:-translate-y-5 
    peer-focus:px-1
    peer-focus:bg-yellow-500
    peer-focus:text-custom-blue      
    peer-valid:text-sm  
    peer-valid:-translate-y-5
    peer-valid:px-1            
    peer-valid:bg-yellow-500
    peer-valid:text-custom-blue     
    "
          >
            Password
          </span>
        </label>

        <button
          className=" text-yellow-500 border border-yellow-500  p-3 rounded-lg uppercase hover:opacity-[95%] disabled:[80%]"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth></OAuth>
      </form>
      <div className="flex gap-2 mt-5 text-yellow-500">
        {" "}
        <p>Do not have an account?</p>
        <Link to="/sign-up" className=" hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Signin;
