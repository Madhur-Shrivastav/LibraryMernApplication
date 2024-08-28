import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="shadow-md bg-yellow-300 hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageURLS[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-[1.05] transition-scale duration-[300ms]"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-bold text-slate-700">
            {listing.title}
          </p>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-600 font-semibold truncate w-full">
              Author: {listing.author}
            </p>
          </div>
          <p className="text-sm text-gray-600 font-semibold line-clamp-2">
            Description: {listing.description}
          </p>

          <p className="text-red-600 mt-2 font-semibold ">
            Price: Rupees {listing.price.toLocaleString("en-US")}
            {listing.for === "rent" && " / month"}
          </p>

          {listing.discount > 0 ? (
            <p className=" mt-2 text-green-600 font-semibold ">
              Discout: Rupees {listing.discount.toLocaleString("en-US")}
              {listing.for === "rent" && " / month"}
            </p>
          ) : (
            ""
          )}
        </div>
      </Link>
    </div>
  );
}
