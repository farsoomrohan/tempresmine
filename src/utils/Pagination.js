import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
const Pagination = ({ nPages, currentPage, setCurrentPage, loading }) => {
  if (!Number.isInteger(nPages) || nPages <= 1) {
    nPages = 1;
  }

  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);
  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  return (
    !loading && (
      <nav>
        <ul className="flex justify-center my-4 items-center list-none">
          <li
            className={`mx-1 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <button
              className="w-8 h-8 rounded-full flex justify-center items-center  bg-white shadow-xl hover:border-gray-700 hover:text-gray-700 transition"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faStepBackward} />
            </button>
          </li>
          <li
            className={`mx-1 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <button
              className="w-8 h-8 rounded-full flex justify-center items-center  bg-white shadow-xl hover:border-gray-700 hover:text-gray-700 transition"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
          </li>
          {pageNumbers.map((pgNumber) => (
            <li
              key={pgNumber}
              className={`mx-1 ${pgNumber === currentPage ? "text-white" : ""}`}
            >
              <button
                className={`w-8 h-8  border-gray-300 rounded-full flex justify-center items-center text-sm ${
                  pgNumber === currentPage
                    ? "bg-textHeading text-white font-bold"
                    : "bg-gray-200 hover:border-gray-700 hover:text-gray-700 transition"
                }`}
                onClick={() => setCurrentPage(pgNumber)}
              >
                {pgNumber}
              </button>
            </li>
          ))}
          <li
            className={`mx-1 ${
              currentPage === nPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <button
              className="w-8 h-8 rounded-full flex justify-center items-center  bg-white shadow-xl hover:border-gray-700 hover:text-gray-700 transition"
              onClick={nextPage}
              disabled={currentPage === nPages}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </li>
          <li
            className={`mx-1 ${
              currentPage === nPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <button
              className="w-8 h-8 rounded-full flex justify-center items-center  bg-white shadow-xl hover:border-gray-700 hover:text-gray-700 transition"
              onClick={() => setCurrentPage(nPages)}
              disabled={currentPage === nPages}
            >
              <FontAwesomeIcon icon={faStepForward} />
            </button>
          </li>
        </ul>
      </nav>
    )
  );
};

export default Pagination;
