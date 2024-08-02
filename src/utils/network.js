import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const NetworkError = () => {
  return (
    <>
      {/* <NavBar /> */}
      <div className="flex flex-col items-center content-center justify-center h-full">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          color="#dfb007"
          className="w-24 h-24"
        />
        <h1 className="text-4xl font-bold pt-2">Network Error</h1>
        <p className="text-lg mt-4">
          It looks like you are not connected to the internet.
        </p>
      </div>
    </>
  );
};

export default NetworkError;
