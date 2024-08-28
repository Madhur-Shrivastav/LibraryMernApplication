import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import { FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact.js";

const Listing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState({ imageURLS: [] });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const getListingData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/listing/get/${params.listingid}`, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (data.success === false) {
          setErrorMessage(data.message);
          setError(true);
        } else {
          setListing(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setErrorMessage(error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getListingData();
  }, [params.listingid]);

  return (
    <main className="">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">{errorMessage}</p>}
      {!loading && !error && listing.imageURLS.length > 0 && (
        <div className="p-3">
          <Swiper navigation>
            {listing.imageURLS.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "contain",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col items-center max-w-4xl mx-auto p-3 my-7 gap-4 bg-custom-blue rounded-lg text-white">
            <p className="text-2xl font-semibold text-white">
              {listing.title} - Rupees{" "}
              {listing.discount > 0
                ? (listing.price - listing.discount).toLocaleString("en-US")
                : listing.price.toLocaleString("en-US")}
              {listing.for === "rent" && " / month"}
            </p>
            <div className="flex flex-col items-center  gap-4 sm:flex-row ">
              <p className="bg-red-900  max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.for === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.discount > 0 && (
                <p className="bg-green-900  max-w-[200px] text-white text-center p-1 rounded-md">
                  Rupees {listing.discount} OFF
                </p>
              )}
            </div>
            <div className="flex flex-col items-center gap-4 ">
              <p className="text-white">
                <span className="font-semibold text-white">Author - </span>
                {listing.author}
              </p>
              <p className="text-white">
                <span className="font-semibold text-white">Publisher - </span>
                {listing.publisher}
              </p>
              <p className="text-white">
                <span className="font-semibold text-white">Description - </span>
                {listing.description}
              </p>
              <p className="text-white">
                <span className="font-semibold text-white">
                  Release Date: -{" "}
                </span>
                {listing.releasedate}
              </p>
              <p className="text-white">
                <span className="font-semibold text-white">
                  Purchase Date: -{" "}
                </span>
                {listing.purchasedate}
              </p>
              {listing.pages > 0 && (
                <p className="text-white">
                  <span className="font-semibold text-white">Pages: - </span>
                  {listing.pages}
                </p>
              )}
            </div>
            {currentUser && listing.owner !== currentUser._id && !contact && (
              <button
                className="bg-slate-700 text-white rounded uppercase hover:opacity-[95%] p-3 w-full sm:w-[50%]"
                onClick={() => setContact(true)}
              >
                Contact Owner
              </button>
            )}
            {contact && <Contact listing={listing}></Contact>}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
