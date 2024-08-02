import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import bgimg from "../images/bgimg.png";
import AxiosUtility from "../utils/AxiosUtility";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import ResumePDF from "./downloadPDF";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const URL = `${process.env.REACT_APP_URL}`;

const ResumeSummaryPage = ({ handleNetworkError }) => {
  const { _id } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewPDF, setViewPDF] = useState(false);
  const handleViewPDF = () => {
    setViewPDF(true);
  };

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [_id]);

  const handleBack = () => {
    navigate(`/matched/resumeslist/${resumeData?.jdId}`);
  };

  return (
    <>
      <NavBar />
      <div
        className="relative"
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-16 py-8">
          <div className="flex flex-row items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="w-full flex items-center justify-center px-1 py-1 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-textHeading sticky top-0">
              Viewing Resume Summary for Candidate - {resumeData?.name}{" "}
            </h1>
          </div>
          {viewPDF ? (
            <div className="mt-4">
              <PDFViewer width="100%" height="600">
                <ResumePDF resumeData={resumeData} />
              </PDFViewer>
            </div>
          ) : (
            <div
              className="bg-white rounded-lg shadow-lg p-8 mt-4 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 13rem)" }}
            >
              {loading && (
                <div className="flex justify-center items-center mt-8">
                  <div
                    className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-textHeading motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                </div>
              )}
              {error && <p className="text-red-700">{error}</p>}
              {resumeData && (
                <div className="text-gray-700">
                  <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl font-bold mb-2 text-textHeading underline">
                      Resume Summary
                    </h2>
                    <div className="mt-4">
                      <PDFDownloadLink
                        document={<ResumePDF resumeData={resumeData} />}
                        fileName={`${resumeData.name}_resume_summary.pdf`}
                        className="bg-textHeading text-white font-bold py-2 px-4 rounded"
                      >
                        {({ loading }) =>
                          loading
                            ? "Generating PDF..."
                            : "Download Summary as PDF"
                        }
                      </PDFDownloadLink>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <span>
                      <strong>Name:</strong> {resumeData?.name}
                    </span>
                    <span>
                      <strong>Email:</strong> {resumeData?.email}
                    </span>
                    <span>
                      <strong>Phone:</strong> {resumeData?.phone}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mt-4 underline text-textHeading">
                    Skills
                  </h3>
                  <div className="flex flex-row items-center gap-x-2 mt-2">
                    <span className="font-bold mr-2">Primary Skills:</span>
                    <span>
                      {resumeData?.skills?.primary?.skills?.join(", ")}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-x-2 mt-2">
                    <span className="font-bold mr-2">Optional Skills:</span>
                    <span>
                      {resumeData?.skills?.optional?.skills?.join(", ")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mt-4 text-textHeading underline">
                    Work Summary
                  </h3>
                  {resumeData?.workSummary?.map((work, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex flex-col items-start gap-2">
                        <span>
                          <strong>Job Title:</strong> {work?.job_title}
                        </span>
                        <span>
                          <strong>Organization:</strong> {work?.organization}
                        </span>
                        <span>
                          <strong>Summary:</strong>{" "}
                          {work?.summary_of_this_project}
                        </span>
                        <span>
                          <strong>Technology Stack:</strong>{" "}
                          {work?.technology_stack?.join(", ")}
                        </span>
                      </div>
                    </div>
                  ))}
                  <h3 className="text-lg font-bold mt-4 text-textHeading underline">
                    Education
                  </h3>
                  {resumeData?.education?.map((education, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex flex-col items-start gap-2">
                        <span>
                          <strong>Degree:</strong> {education?.degree || "NA"}
                        </span>
                        <span>
                          <strong>University:</strong>{" "}
                          {education?.institution || "NA"}
                        </span>
                        <span>
                          <strong>Year:</strong> {education?.duration || "NA"}
                        </span>
                        <span>
                          <strong>Location:</strong>{" "}
                          {education?.location || "NA"}
                        </span>
                      </div>
                    </div>
                  ))}
                  <h3 className="text-lg font-bold mt-4 text-textHeading underline">
                    Certifications
                  </h3>
                  <div className="flex flex-col items-start gap-2">
                    <span>{resumeData?.certifications.join(", ")}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeSummaryPage;
