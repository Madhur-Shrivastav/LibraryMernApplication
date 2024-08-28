import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formdata, setformdata] = useState({});
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);
  const navigate = useNavigate();

  const handleChange = async (event) => {
    setformdata({
      ...formdata,
      [event.target.id]: event.target.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setloading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formdata),
    });
    const data = await res.json();
    if (data.success === false) {
      seterror(data.message);
      setloading(false);
      return;
    }
    setloading(false);
    seterror(null);
    navigate("/sign-in");
    console.log(data);
  };

  return (
    <div className="p-3 max-w-lg mx-auto text-yellow-500">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form
        className=" flex flex-col gap-4 p-3 bg-custom-blue rounded-lg"
        onSubmit={handleSubmit}
      >
        <label className="relative w-full my-3">
          <input
            type="text"
            id="username"
            className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
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
            Username
          </span>
        </label>
        <label className="relative w-full my-3">
          <input
            type="text"
            id="email"
            className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
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
            className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        {" "}
        <p>Have an account?</p>
        <Link to="/sign-in" className="text-yellow-500 hover:underline">
          Sign In
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default Signup;
