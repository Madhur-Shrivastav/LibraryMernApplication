import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    for: "all",
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const forFromUrl = urlParams.get("for") || "all";
    const sortFromUrl = urlParams.get("sort") || "created_at";
    const orderFromUrl = urlParams.get("order") || "desc";

    setSidebardata({
      searchTerm: searchTermFromUrl,
      for: forFromUrl,
      sort: sortFromUrl,
      order: orderFromUrl,
    });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);
  console.log(sidebardata);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: value });
    } else if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata({ ...sidebardata, sort, order });
    } else {
      setSidebardata({ ...sidebardata, for: id });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebardata);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", numberOfListings);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    setShowMore(data.length >= 9);
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row bg-custom-blue">
      <div className="p-7 border-b-2 border-yellow-500  md:border-r-2 md:min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 p-3  text-white"
        >
          <div className="flex items-center gap-2">
            <label className="relative w-full my-3">
              <input
                type="text"
                id="searchTerm"
                className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer"
                value={sidebardata.searchTerm}
                onChange={handleChange}
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
                Search Term
              </span>
            </label>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">For:</label>
            <div className="flex gap-2">
              <input
                type="radio"
                id="all"
                name="for"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.for === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                name="for"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.for === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                name="for"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.for === "sale"}
              />
              <span>Sale</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              id="sort_order"
              className="border rounded-lg p-3 text-black"
            >
              <option value="price_desc">Price high to low</option>
              <option value="price_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="text-yellow-500 border border-yellow-500  p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1 text-center">
        <h1 className="text-3xl font-semibold sm:border-b sm:border-yellow-500 p-3 text-yellow-500 mt-5">
          Available Books:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-red-500 ">No book found!</p>
          )}
          {loading && (
            <p className="text-xl text-yellow-500  text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
