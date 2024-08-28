import { useEffect, useState } from "react";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formdata, setformdata] = useState({
    imageURLS: [],
    title: "",
    author: "",
    description: "",
    releasedate: "",
    purchasedate: "",
    publisher: "",
    pages: 0,
    for: "rent",
    price: 0,
    discount: 0,
  });

  useEffect(() => {
    const getListingData = () => {
      fetch(`/api/listing/get/${params.listingid}`, { method: "GET" })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          if (data.success === false) {
            console.log(data.message);
          } else {
            setformdata(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    getListingData();
  }, [params.listingid]);

  const [uploading, setuploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

  const [formError, setFormError] = useState(null);
  const [formloading, setformloading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formdata.imageURLS.length <= 6) {
      setuploading(true);
      setImageUploadError(false);

      const newImageUrls = [];
      let completedUploads = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storage = getStorage(app);
        const filename = new Date().getTime() + file.name;
        const storageref = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageref, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              newImageUrls.push(downloadURL);
              completedUploads++;

              // If all uploads are complete, update the state
              if (completedUploads === files.length) {
                setformdata((prevFormdata) => ({
                  ...prevFormdata,
                  imageURLS: [...prevFormdata.imageURLS, ...newImageUrls],
                }));
                setImageUploadError(false);
                setuploading(false);
              }
            });
          }
        );
      }
    } else {
      setImageUploadError("Cannot upload more than 6 images!");
      setuploading(false);
    }
  };

  // const handleImageSubmit = async () => {
  // // if (files.length > 0 && files.length + formdata.imageURLS.length <= 6) {
  // setuploading(true);
  // setImageUploadError(false);
  // const uploadpromises = [];
  // for (let file = 0; file < files.length; file++) {
  // uploadpromises.push(storeImage(files[file]));
  // }
  // Promise.all(uploadpromises)
  // .then((imageURLS) => {
  // setformdata({
  // ...formdata,
  // imageURLS: [...formdata.imageURLS, ...imageURLS],
  // });
  // setImageUploadError(false);
  // setuploading(false);
  // })
  // .catch((error) => {
  // // setImageUploadError("Cannot upload an image above 2MB of size!");
  // setuploading(false);
  // });
  // } else {
  // // setImageUploadError("You can only upload atleast 1 and atmost 6 images!");
  // setuploading(false);
  // }
  // };

  // const storeImage = async (file) => {
  // return new Promise((resolve, reject) => {
  // const storage = getStorage(app);
  // const filename = new Date().getTime() + file.name;
  // const storageref = ref(storage, filename);
  // // const uploadTask = uploadBytesResumable(storageref, file);
  // uploadTask.on(
  // "state_changed",
  // (snapshot) => {
  // const progress =
  // // (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  // console.log(progress);
  // },
  // (error) => {
  // reject(error);
  // },
  // () => {
  // // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  // resolve(downloadURL);
  // });
  // }
  // );
  // });
  // };

  const handleRemoveImage = (index) => {
    setformdata({
      ...formdata,
      imageURLS: formdata.imageURLS.filter((imageURL, i) => i !== index),
    });
  };

  const handleOnChange = (event) => {
    if (event.target.id === "sale" || event.target.id === "rent") {
      setformdata({
        ...formdata,
        for: event.target.id,
      });
    }
    if (
      event.target.type === "number" ||
      event.target.type === "text" ||
      event.target.type === "textarea"
    ) {
      setformdata({
        ...formdata,
        [event.target.id]: event.target.value,
      });
    }
  };

  console.log(formdata);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (+formdata.discount > +formdata.price) {
        return setFormError("Discount cannot be more than the price!");
      }
      if (formdata.imageURLS.length < 1) {
        return setFormError("Atleast one image URL must be provided!");
      }
      setformloading(true);
      setFormError(false);
      const res = await fetch(`/api/listing/update/${params.listingid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formdata, owner: currentUser._id }),
      });
      const data = await res.json();
      setformloading(false);
      if (data.success === false) {
        setFormError(data.message);
        setformloading(false);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setFormError(error.message);
      setformloading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto ">
      <h1 className=" text-yellow-500 text-3xl font-semibold text-center my-7 ">
        Update Listing
      </h1>
      <form
        className="flex flex-col sm:flex-row gap-4 p-3 bg-custom-blue rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 flex-1">
          <label className="relative w-full my-3">
            <input
              type="text"
              id="title"
              className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer"
              value={formdata.title}
              onChange={handleOnChange}
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
              Title
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="text"
              id="author"
              className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer"
              value={formdata.author}
              onChange={handleOnChange}
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
              Author
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="text"
              id="publisher"
              className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer"
              value={formdata.publisher}
              onChange={handleOnChange}
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
              Publisher
            </span>
          </label>
          <label className="relative w-full my-3">
            <textarea
              type="text"
              id="description"
              className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-2 border-yellow-500 
appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer"
              value={formdata.description}
              onChange={handleOnChange}
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
              Description
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="text"
              id="releasedate"
              className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer"
              value={formdata.releasedate}
              onChange={handleOnChange}
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
              Release Date
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="text"
              id="purchasedate"
              className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer"
              value={formdata.purchasedate}
              onChange={handleOnChange}
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
              Purchase Date
            </span>
          </label>

          <div className="flex justify-evenly flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5 "
                onChange={handleOnChange}
                checked={formdata.for === "sale"}
              ></input>
              <span className="text-white">Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleOnChange}
                checked={formdata.for === "rent"}
              ></input>
              <span className="text-white">Rent</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <label className="relative w-full my-3">
                <input
                  type="number"
                  id="pages"
                  min="0"
                  max="10000"
                  className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none"
                  value={formdata.pages}
                  onChange={handleOnChange}
                  required
                />
              </label>

              <div className="flec flex-col items-center text-white">
                <p>No. of pages</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative w-full my-3">
                <input
                  type="number"
                  id="price"
                  min="0"
                  className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none"
                  value={formdata.price}
                  onChange={handleOnChange}
                  required
                />
              </label>

              <div className="flec flex-col items-center text-white">
                <p>Price</p>
                <span className="text-sm">
                  {formdata.for === "sale" ? "Rupees" : "Rupees/month"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative w-full my-3">
                <input
                  type="number"
                  id="discount"
                  min="0"
                  className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none"
                  value={formdata.discount}
                  onChange={handleOnChange}
                  required
                />
              </label>

              <div className="flec flex-col items-center text-white">
                <p>Discount</p>
                <span className="text-sm">
                  {formdata.for === "sale" ? "Rupees" : "Rupees/month"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4  text-white">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-white">
              The 1st image will be the cover max 6
            </span>
          </p>
          {formError || imageUploadError ? (
            <p className="text-red-700">
              {(formError && formError) ||
                (imageUploadError && imageUploadError)}
            </p>
          ) : (
            ""
          )}
          <div className="flex gap-4">
            <input
              className="p-3 border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(event) => {
                setFiles(event.target.files);
              }}
            ></input>
            <button
              type="button"
              disabled={uploading}
              className="p-3 text-green-700 border border-yellow-500 rounded uppercase hover:shadow-lg disabled:opacity-
[80%]"
              onClick={handleImageSubmit}
            >
              {uploading ? "uploading...." : "upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>

          {formdata.imageURLS.length > 0 &&
            formdata.imageURLS.map((imageURL, index) => (
              <div
                className="flex justify-between p-3 border items-center border-yellow-500 rounded-lg"
                key={index}
              >
                <img
                  src={imageURL}
                  className="w-20 h-20 object-contain rounded-lg"
                />

                <button
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-[75%]"
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={formloading || uploading}
            className="p-3 bg-custom-blue text-green-700 border border-yellow-500 rounded-lg uppercase hover:opacity-
[95%] disabled:opacity-[80%]"
          >
            {formloading ? "Updating...." : "Update Listing"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
