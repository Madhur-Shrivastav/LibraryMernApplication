import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Contact = ({ listing }) => {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState("");
  const params = useParams();
  useEffect(() => {
    const getOwner = async () => {
      await fetch(`/api/user/${listing.owner}`, { method: "GET" })
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
            setOwner(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    getOwner();
  }, [params.listingid]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
      {owner && (
        <div className="flex flex-col gap-2 ">
          <p>
            Contact <span className="font-semibold">{owner.username}</span> for{" "}
            <span className="font-semibold">{listing.title}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${owner.email}?subject=Regarding ${listing.title}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:[95%]"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
