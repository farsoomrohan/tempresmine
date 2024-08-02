import React from "react";
import NavBar from "./NavBar";
import JobCardViewList from "../pages/JobCardViewList";

function HomePage({ handleNetworkError }) {
  return (
    <>
      <NavBar />
      <div className="relative  ">
        <div className="container mx-auto px-16 py-8">
          <JobCardViewList handleNetworkError={handleNetworkError} />
        </div>
      </div>
    </>
  );
}

export default HomePage;
