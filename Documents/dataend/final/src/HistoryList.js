// AccidentsList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HistoryList({ dataUrl }) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(dataUrl);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();

    // Set up a timer to fetch data every 10 seconds (adjust as needed)
    const intervalId = setInterval(fetchData, 10000);

    // Clean up the timer when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const redirectToMaps = (googleMapsLink) => {
    window.open(googleMapsLink, "_blank");
  };

  const handleDelete = async (itemId) => {
    try {
      const itemToDelete = data.find((item) => item._id === itemId);
      await axios.post("https://accident-backend.onrender.com/data/delete", {
        _id: itemId,
      });
      fetchData();
      console.log(`Item with ID ${itemId} deleted.`);
      if (itemToDelete) {
        await axios.post(
          "https://accident-backend.onrender.com/history/history",
          {
            accident: itemToDelete.accident,
            location: itemToDelete.location,
            date: itemToDelete.date,
          }
        );
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <nav className="bg-red-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white font-bold text-xl">
            Accidents List
          </Link>
          <Link
            to="/"
            className="bg-white hover:bg-red-800 text-red-800 hover:text-white px-4 py-2 rounded-full"
          >
            Go Back
          </Link>
        </div>
      </nav>
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div
              key={item._id}
              className="w-80 bg-red-600 text-white border border-gray-800 p-4 rounded-lg shadow-md relative"
            >
              <div className="text-lg font-bold mb-2 capitalize">
                Accident Detected!!
              </div>
              <div className="mb-2">
                <h2 className="text-base font-bold mb-1">Location</h2>
                <p className="text-sm">
                  <span className="font-bold">Latitude:</span>{" "}
                  {item.location.latitude}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Longitude:</span>{" "}
                  {item.location.longitude}
                </p>
              </div>
              <div className="mb-2">
                <h2 className="text-base font-bold mb-1">Date (UTC)</h2>
                <p className="text-sm">{new Date(item.date).toUTCString()}</p>
              </div>
              <div className="mb-2">
                <h2 className="text-base font-bold mb-1">Time (IST)</h2>
                <p className="text-sm">
                  {new Date(item.date).toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
              </div>
              <div className="font-bold">
                Open in Maps: {item.location.googleMapsLink}
              </div>
              <button
                onClick={() => redirectToMaps(item.location.googleMapsLink)}
                className="mt-4 rounded-md bg-red-800 hover:bg-red-900 hover:text-white duration-300 p-2 mr-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-external-link"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryList;
