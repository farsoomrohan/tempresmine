import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import globeBackground from "../images/bgimg.png";
import FirstSection from "./ResumeAnalysisReport/FirstSection";
import SkillsMatchReport from "./ResumeAnalysisReport/SkillsMatchReport";
import { useNavigate, useParams } from "react-router-dom";
import AxiosUtility from "../utils/AxiosUtility";
import FeedbackSection from "./ResumeAnalysisReport/FeedbackSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const ResumeAnalysisReport = ({ handleNetworkError }) => {
  const { _id } = useParams();
  const URL = `${process.env.REACT_APP_URL}`;
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await AxiosUtility({
          url: `${URL}/resume/${_id}`,
          method: "GET",
          onNetworkError: handleNetworkError,
        });
        setResumeData(response);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeData();
  }, [_id]);

  return (
    <div>
      <NavBar />
      <div
        className="relative min-h-screen flex flex-col items-center py-8 font-quicksand"
        style={{
          backgroundImage: `url(${globeBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container w-4/5 flex flex-col gap-8 ">
          <div className="flex flex-row gap-4 items-center content-center">
            <button
              type="button"
              // onClick={handleBack}
              onClick={() => {
                navigate(`/matched/resumeslist/${resumeData?.jdId}`);
              }}
              className="w-full flex items-center justify-center px-1 py-1 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="w-4 h-4" />
            </button>
            <span className="text-xl text-textHeading font-bold">
              Resume Analysis Report
            </span>
          </div>
          {/* Kareem */}
          {isLoading ? (
            <div className="flex justify-center items-center mt-8">
              <div
                className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-textHeading motion-reduce:animate-[spin_1.5s_linear_infinite]">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          ) : (
            <>
              <FirstSection resumeData={resumeData} />
              <SkillsMatchReport resumeData={resumeData} />
              <FeedbackSection resumeData={resumeData} URL={URL} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysisReport;
