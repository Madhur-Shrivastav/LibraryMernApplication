import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [fileerror, setFileerror] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [formdata, setFormdata] = useState({});
  const [showlistingError, setShowlistingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  console.log(formdata);
  console.log(userListings.length > 0);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = `${new Date().getTime()}_${file.name}`;
    const storageref = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageref, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercentage(Math.round(progress));
      },
      (err) => {
        setFileerror(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormdata((prevFormdata) => ({
            ...prevFormdata,
            photo: downloadURL,
          }));
        });
      }
    );
  };

  const handleChange = async (event) => {
    setFormdata({ ...formdata, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        alert(data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      alert("Profile updated successfully");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      alert(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        alert(data.message);
        return;
      }
      dispatch(deleteUserSuccess(data));
      alert(data.message);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout", {
        method: "GET",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure);
        alert(data.message);
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
      alert(error.message);
    }
  };

  const handleShowListings = async () => {
    try {
      setShowlistingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowlistingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowlistingError(true);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((previousdata) =>
        previousdata.filter((listing) => listing._id !== id)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-white text-center my-7">
        Profile
      </h1>
      <form
        className="flex  p-3 flex-col gap-4 rounded-lg bg-custom-blue"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(event) => {
            setFile(event.target.files[0]);
          }}
        ></input>
        <img
          src={formdata.photo ? formdata.photo : currentUser.photo}
          className="rounded-full  h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
          id="userphoto"
        ></img>
        <p className="text-center">
          {fileerror ? (
            <span className="text-red-700">Error in uploading</span>
          ) : percentage > 0 && percentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${percentage} %`}</span>
          ) : percentage === 100 ? (
            <span className="text-green-700">Successfully Uploaded</span>
          ) : (
            ""
          )}
        </p>
        <label className="relative w-full my-3">
          <input
            type="text"
            id="username"
            className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer"
            defaultValue={currentUser.username}
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
            className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 appearance-none 
focus:outline-none focus:border-2 focus:border-yellow-500 peer"
            defaultValue={currentUser.email}
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
            className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 appearance-none 
focus:outline-none focus:border-2 focus:border-yellow-500 peer"
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
          className=" text-blue-700 border rounded-lg border-yellow-500 p-3 uppercase hover:opacity-[95%] disabled:opacity-[80%]"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create"
          className=" border border-yellow-500 text-green-700 p-3 rounded-lg uppercase text-center hover:opacity-[95%]"
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between bg-custom-blue p-3 my-3 border rounded-lg border-yellow-500">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>

      <button
        className="text-green-700 bg-custom-blue w-full p-3 uppercase hover:opacity-[95%] disabled:opacity-[80%] border border-yellow-500 rounded-lg "
        onClick={handleShowListings}
      >
        Show Listings
      </button>

      <p>{showlistingError ? "Error in showing listings" : ""}</p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4 ">
          <h1 className="text-center mt-7 text-2xl font-semibold text-yellow-500">
            Your Listings
          </h1>
          {userListings.map((listing, index) => (
            <div
              className="border rounded-lg border-yellow-500 p-3 flex justify-between items-center gap-4 bg-custom-blue"
              key={index}
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageURLS[0]}
                  alt="listing-image"
                  className="h-16 w-16 object-contain hover:scale-[1.2] transition-scale duration-[300ms]"
                ></img>
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-blue-700 font-semibold flex-1 hover:underline truncate"
              >
                <p>{listing.title}</p>
              </Link>
              <div className=" flex flex-col items-center">
                <button
                  className="text-red-700 uppercase"
                  onClick={() => handleDeleteListing(listing._id)}
                >
                  Delete
                </button>
                <Link to={`/update/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
