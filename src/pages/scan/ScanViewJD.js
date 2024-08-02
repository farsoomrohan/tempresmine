import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faCloudArrowUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast } from "../../utils/toastUtility";
import AxiosUtility from "../../utils/AxiosUtility";
import Loading from "react-loading";
import { getUploadETA } from "../../utils/getUploadETA";

function ScanViewJobDescription({ handleNetworkError }) {
  const { jdId } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [jdData, setJdData] = useState([]);
  const navigate = useNavigate();

  const url = `${process.env.REACT_APP_URL}`;

  const messages = [
    "Please wait while we provide the perfect candidate for this job description!",
    "Analyzing resumes for the perfect match!",
    "Compiling the best matches based on skills and experience.",
    "Almost there! Fine-tuning the selection process.",
    "Analyzing resumes for a perfect match!",
    "Matching skills and experience for you.",
    "Almost done! Fine-tuning selections.",
    "Scanning resumes for top talent.",
    "Identifying the best candidates for you.",
    "Optimizing the selection process.",
    "Evaluating resumes for ideal matches.",
    "Processing data for best results.",
    // Add more messages as needed
  ];
  useEffect(() => {
    let interval;
    if (fileUploadLoading) {
      interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 8000); // Change message every 8 seconds
    }

    return () => clearInterval(interval);
  }, [fileUploadLoading]);


  useEffect(() => {
    if (jdId) {
      fetchData(jdId);
    }
  }, [jdId]);

  const fetchData = async (jdId) => {
    setIsLoading(true);
    try {
      const response = await AxiosUtility({
        url: `${url}/job-details/getSingleJobDetail/${jdId}`,
        method: "GET",
        onNetworkError: handleNetworkError,
      });
      if (response) {
        setJdData(response.jobDetail);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/home");
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const allowedFormats = [".pdf"]; // Allowed file formats
    files.forEach((file) => {
      const fileSizeInMB = file.size / (1024 * 1024); // Size in MB

      if (fileSizeInMB > 1) {
        showErrorToast("File size exceeds the limit of 1MB."); // File size exceeds 1MB
      } else if (!allowedFormats.some((format) => file.name.endsWith(format))) {
        showErrorToast("Invalid file format. Please upload a .pdf file."); // File format is not .pdf
      } else if (
        uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)
      ) {
        showErrorToast(
          "File already uploaded. Please upload a different file."
        ); // File already uploaded
      } else {
        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          file, // Store the actual File object
        ]);
      }
    });
  };

  const handleScanFiles = async () => {
    setFileUploadLoading(true);
    try {
      // Create a new form data
      let formData = new FormData();

      // Append all files to the form data
      uploadedFiles.forEach((file) => {
        formData.append("files", file); // Append the actual File object
      });

      // Upload files to the server
      const response = await AxiosUtility({
        url: `${url}/resume/files?jdId=${jdId?.toString()}`,
        method: "POST",
        data: formData,
        fileUpload: true,
        onNetworkError: handleNetworkError,
      });

      // If the response is successful, navigate to the resume list page
      if (response) {
        setFileUploadLoading(false);
        navigate(`/matched/resumeslist/${jdId}`, {
          state: { data: jdData },
        }); // Navigate to the job description matching resume list table screen
      }
      // If the response is unsuccessful, show an error
    } catch (error) {
      console.error("Failed to upload data", error);
    } finally {
      setFileUploadLoading(false);
    }
  };

  const handleRemoveFile = (fileName) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  return (
    <>
      <NavBar />

      <div className="relative ">
        <div className="relative container mx-auto xl:px-8 py-4">
          <div className=" xl:px-4">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full flex items-center justify-center px-1 py-1 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto  hover:bg-gray-100 "
                >
                  <FontAwesomeIcon icon={faAngleLeft} className="w-5 h-5" />
                </button>
                <label className="font-bold text-textHeading text-lg">
                  {" "}
                  Back to JD List
                </label>
              </div>
              <div className="mr-2 mb-2 ">
                <button
                  onClick={() => {
                    navigate(`/matched/resumeslist/${jdData?._id}`, {
                      state: { data: jdData },
                    });
                  }}
                  className="text-textHeading flex justify-end text-base font-bold"
                >
                  <u> List of Resumes for this JD</u>
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center mt-8">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-textHeading motion-reduce:animate-[spin_1.5s_linear_infinite]">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white flex flex-col lg:flex-row px-10 lg:px-0 py-8 mt-2 rounded-md">
                {/* JD view */}
                <div className="lg:w-2/4 lg:pr-10 pl-6">
                  <div>
                    <p className="text-sm text-textHeading font-bold">
                      Client Name : {jdData?.clientName}
                    </p>
                    <p className="text-sm text-textHeading font-bold my-2">
                      Job Title : {jdData?.jobTitle}
                    </p>
                    <p className="text-nmlText text-lighterText font-medium pt-2">
                      Experience : {jdData?.minExpRequired} -{" "}
                      {jdData?.maxExpRequired} Years
                    </p>
                  </div>
                  <div className="mt-4 ">
                    <p className=" font-semibold text-nmlText text-textHeading">
                      Job Description
                    </p>
                    <div className="max-h-[300px] lg:max-h-[600px] xl:max-h-[300px] 2xl:max-h-[300px] border text-nmlText border-gray-200 px-3 py-6 overflow-auto">
                      <p
                        className="text-justify"
                        dangerouslySetInnerHTML={{
                          __html: jdData?.jobDescription,
                        }}
                      ></p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className="mt-4 ">
                      <p className="font-semibold text-nmlText text-textHeading">
                        Primary Skills
                      </p>
                      <div className="flex flex-wrap">
                        {jdData?.primarySkills?.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block text-nmlText px-2 py-1 mr-2 mb-2 rounded-md bg-gray-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="mt-4 ml-4">
                        <p className="font-semibold text-nmlText text-textHeading">
                          Good to have Skills
                        </p>
                        <div className="flex flex-wrap">
                          {jdData?.goodToHaveSkills?.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-block text-nmlText px-2 py-1 mr-2 mb-2 rounded-md bg-gray-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Vertical Line */}
                <div className="hidden lg:block w-1 bg-textHeading rounded-md"></div>
                {/* upload files */}
                <div className={`2xl:ml-24 2xl:mt-16 lg:ml-16 mt-12 lg:mt-16 ${fileUploadLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <div>
                    <div className="flex w-full items-center justify-center ">
                      <label
                        htmlFor="dropzone-file"
                        className={`flex h-32 w-64 sm:w-64 md:w-64 xl:w-96 2xl:w-96 lg:w-96 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 ${fileUploadLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                          <FontAwesomeIcon
                            icon={faCloudArrowUp}
                            size="2xl"
                            style={{ color: "#2C4B84" }}
                          />
                          <p className="mb-2 text-nmlText text-gray-500 ">
                            <span className="font-semibold">
                              {uploadedFiles.length > 0
                                ? `${uploadedFiles.length} file(s) uploaded`
                                : "Browse files"}
                            </span>{" "}
                          </p>
                          <p className="text-[12px] text-gray-500 ">
                            {/* Supported format: .docx .doc or .pdf Max size: 1MB */}
                            Supported format: .pdf Max size: 1MB
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          multiple={true}
                          onChange={handleFileChange}
                          disabled={fileUploadLoading}
                        />
                      </label>
                    </div>

                    {/* file uploading resume list rows with X to remove */}
                    <div className={`mt-4 w-full max-h-[200px] overflow-auto ${fileUploadLoading ? 'pointer-events-none cursor-not-allowed' : 'cursor-pointer'}`}>
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={file?.name}
                          className="flex items-center justify-between mt-2 border border-gray-200 rounded-sm p-2"
                        >
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {`${(file.size / 1024).toFixed(2)} KB`}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(file.name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col w-full items-center justify-center mt-8">
                    <button
                      disabled={fileUploadLoading || uploadedFiles.length === 0}
                      onClick={handleScanFiles}
                      className={`flex justify-center items-center h-11 w-64 sm:w-64 md:w-64 xl:w-96 2xl:w-96 lg:w-96 rounded-md text-white font-semibold text-sm ${fileUploadLoading || uploadedFiles.length === 0
                        ? "cursor-not-allowed bg-gray-400"
                        : "cursor-pointer hover:bg-[#3873e0] bg-textHeading"
                        }`}
                    >
                      {fileUploadLoading ? (
                        <Loading
                          type={"bubbles"}
                          color={"#ffffff"}
                          height={"40px"}
                          width={"40px"}
                        /> // display loading animation when loading
                      ) : (
                        "UPLOAD AND SCAN FILES"
                      )}
                    </button>
                    {fileUploadLoading && (
                      <div
                        style={{ maxWidth: 'fit-content' }}
                        key={currentMessageIndex} // Change key on message change
                        className={`mt-3 text-sm font-bold text-gray-500 animate-slideUpFadeIn`}
                      >
                        {currentMessageIndex === 0 ? `Upload in progress. ETA ${getUploadETA(uploadedFiles?.length)}` : messages[currentMessageIndex]}
                        <span className="animate-typing1 inline-block">.</span>
                        <span className="animate-typing2 inline-block">.</span>
                        <span className="animate-typing3 inline-block">.</span>
                      </div>
                    )}
                  </div>

                  {/* GET PROFILE THROUGH LINK CODE */}
                  {/* <div className="flex w-full items-center text-lg font-bold text-lighterText justify-center mt-4 lg:mt-4">
                  <p>Or</p>
                </div>
                <div className="flex w-full items-center justify-center">
                  <div className="relative mt-2 w-64 sm:w-64 md:w-64 xl:w-96 2xl:w-96 lg:w-96">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FontAwesomeIcon
                        icon={faGlobe}
                        style={{ color: "#a2bdeb" }}
                        size="xl"
                      />
                    </div>
                    <input
                      className="w-full h-11 p-4 pl-12 pr-6 text-md text-gray-900 border focus:outline-none  border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500  focus:border-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="https:/www."
                      value={getLink}
                      onChange={(e) => handleFetch(e.target.value)}
                    />
                    {getLink && (
                      <button className="absolute inset-y-0 right-0 flex items-center pr-2 focus:outline-none">
                        <FontAwesomeIcon
                          icon={faCheck}
                          size="xl"
                          style={{ color: "#1C72AE" }}
                        />
                      </button>
                    )}
                  </div>
                </div> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div >
    </>
  );
}

export default ScanViewJobDescription;
