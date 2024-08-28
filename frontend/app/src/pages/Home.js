import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  // useEffect(() => {
  // const fetchOfferListings = async () => {
  // try {
  // // const res = await fetch("/api/listing/get?for=true&limit=4");
  // const data = await res.json();
  // setOfferListings(data);
  // fetchRentListings();
  // } catch (error) {
  // console.log(error);
  // }
  // };
  // const fetchRentListings = async () => {
  // try {
  // // const res = await fetch("/api/listing/get?for=rent&limit=4");
  // const data = await res.json();
  // setRentListings(data);
  // fetchSaleListings();
  // } catch (error) {
  // console.log(error);
  // }
  // };

  // const fetchSaleListings = async () => {
  // try {
  // // const res = await fetch("/api/listing/get?for=sale&limit=4");
  // const data = await res.json();
  // setSaleListings(data);
  // } catch (error) {
  // console.log(error);
  // }
  // };
  // fetchOfferListings();
  // }, []);

  useEffect(() => {
    const fetchRentListings = async () => {
      await fetch("/api/listing/get?for=rent&limit=4")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setRentListings(data);
          return fetchSaleListings(); // Chain the next fetch
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchSaleListings = async () => {
      await fetch("/api/listing/get?for=sale&limit=4")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setSaleListings(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchRentListings();
  }, []);

  return (
    <div className="">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-white font-bold text-3xl lg:text-6xl">
          Find a book based on your type
        </h1>
        <div className="text-white text-xs sm:text-sm">
          Madhur's Library is the best place to find a suitable book to read.
          <br />
          We have a wide range of books for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-white font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-white">
                Recent books for rent
              </h2>
              <Link
                className="text-sm text-white hover:underline"
                to={"/search?type=rent"}
              >
                Show more books for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-white">
                Recent books for sale
              </h2>
              <Link
                className="text-sm text-white hover:underline"
                to={"/search?type=sale"}
              >
                Show more books for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
