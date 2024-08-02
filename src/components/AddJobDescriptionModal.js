import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TagsInput from "./TagsInput";
import Swal from "sweetalert2";
import moment from "moment";
import AxiosUtility from "../utils/AxiosUtility";
import { TextField } from "@material-ui/core";

function AddJobDescriptionModal({
  isOpen,
  setIsOpen,
  updatedJD,
  handleNetworkError,
}) {

  const [content, setContent] = useState("");
  const [clientName, setClientName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [primarySkills, setPrimarySkills] = useState([]);
  const [goodToHaveSkills, setGoodToHaveSkills] = useState([]);
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");

  const url = process.env.REACT_APP_URL;

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["link", "image", "video"],
    ],
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const createSuccessMessage = async () => {
    Swal.fire({
      title: "JD created Successfully!",
      icon: "success",
      showConfirmButton: false,
      timer: 3000,
    });
    setTimeout(function () {
      updatedJD();
      toggleModal();
    }, 2000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(false);
    const isValid = validate();
    const minExpRequired = parseInt(minExperience, 10);
    const maxExpRequired = parseInt(maxExperience, 10);

    if (isValid) {
      try {
        const formData = {
          clientName: clientName,
          jobTitle: jobTitle,
          jobDescription: content,
          primarySkills: primarySkills,
          goodToHaveSkills: goodToHaveSkills,
          minExpRequired,
          maxExpRequired,
        };
        const response = await AxiosUtility({
          url: `${url}/job-details/createJobDetails`,
          method: "POST",
          data: formData,
          onNetworkError: handleNetworkError,
        });

        if (response?.message === "JobDetails created successfully.") {
          createSuccessMessage();
        } else if (
          response?.message?.duplicateErrorMsg ===
          "Same job title exists for this client. Please modify job title, if this is for a different requirement."
        ) {
          let userName = response?.message?.details?.recruiterId?.userName;
          let createdTime = response?.message?.details?.updatedAt;

          createDuplicateMessage(userName, createdTime);
        }
      } catch (error) {
      }
    }
  };


  const createDuplicateMessage = async (userName, createdTime) => {
    Swal.fire({
      position: "top",
      icon: "warning",
      html: `
      <p>Same <b>job title</b> exists for this client. Please modify job title, if this is for a different requirement.</p><br>
        Created by <b>${userName}</b>
        on created date <b>${moment(createdTime).format(
        "DD-MM-YYYY hh:mm A"
      )} </b>
      `,
      showConfirmButton: true,
      showCloseButton: true,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!clientName.trim()) {
      newErrors.clientName = "Client name required!";
    }

    if (!jobTitle.trim()) {
      newErrors.jobTitle = "Job title required!";
    }

    if (!content.trim()) {
      newErrors.content = "Job description required!";
    }

    if (!minExperience.trim()) {
      newErrors.minExperience = "Minimum experince required";
    }

    if (!maxExperience.trim()) {
      newErrors.maxExperience = "Maximum experince required";
    }

    if (
      minExperience.trim() &&
      maxExperience.trim() &&
      parseInt(minExperience) >= parseInt(maxExperience)
    ) {
      newErrors.maxExperience =
        "Maximum experience must be greater than minimum experience";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div>
      {isOpen && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-[40rem] overflow-y-scroll ">
            <div className="relative bg-white rounded-lg shadow ">
              <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t  ">
                <h3 className="text-base font-bold text-textHeading ">
                  Create New Job Description
                </h3>
                <button
                  onClick={toggleModal}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* Modal body */}
              <form className="p-4 md:p-5">
                <div>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="flex flex-row justify-between gap-4">
                      <div className="col-span-2">
                        <TextField
                          label="Client Name"
                          InputProps={{
                            style: {
                              fontSize: "14px",
                              fontFamily: "Quicksand, sans-serif",
                              color: "#000929",
                            },
                          }}
                          variant="outlined"
                          size="small"
                          type="text"
                          name="clientName"
                          id="clientName"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-nmlText rounded-lg block w-[360px] p-[10px] "
                          // placeholder="Client Name"
                          required
                        />
                        {errors.clientName && (
                          <div className="text-red-500 ml-1 text-nmlText font-medium">
                            {errors.clientName}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-row justify-center gap-4">
                        <div>
                          <TextField
                            label="Min(Yrs)"
                            variant="outlined"
                            size="small"
                            InputProps={{
                              style: {
                                fontSize: "14px",
                                fontFamily: "Quicksand, sans-serif",
                                color: "#000929",
                              },
                            }}
                            name="minExperience"
                            type="text"
                            id="minExperience"
                            value={minExperience}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(/\D/g, "");
                              setMinExperience(numericValue);
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-nmlText rounded-lg block w-24 p-[10px] "
                            required
                          />
                        </div>
                        <div>
                          <TextField
                            label="Max(Yrs)"
                            variant="outlined"
                            size="small"
                            name="maxExperience"
                            type="text"
                            InputProps={{
                              style: {
                                fontSize: "14px",
                                fontFamily: "Quicksand, sans-serif",
                                color: "#000929",
                              },
                            }}
                            placeholder="Max"
                            id="maxExperience"
                            value={maxExperience}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(/\D/g, "");
                              setMaxExperience(numericValue);
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-nmlText rounded-lg block w-24 p-[10px]"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row pt-11">
                      {errors.minExperience && (
                        <div className="text-red-500 ml-1 text-nmlText font-medium">
                          {errors.minExperience}
                        </div>
                      )}
                      {errors.maxExperience && (
                        <div className="text-red-500 ml-1 text-nmlText font-medium">
                          {errors.maxExperience}
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <TextField
                        label="Job title"
                        variant="outlined"
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            fontFamily: "Quicksand, sans-serif",
                            color: "#000929",
                          },
                        }}
                        size="small"
                        type="text"
                        name="jobTitle"
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-nmlText rounded-lg  block w-full p-[10px] "
                        // placeholder="Job title"
                        required
                      />
                      {errors.jobTitle && (
                        <div className="text-red-500 ml-1 text-sm font-medium">
                          {errors.jobTitle}
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="jobDescription"
                        className="block mb-2 text-nmlText font-semibold text-normalText "
                      >
                        Job Description
                      </label>
                      <ReactQuill
                        className="w-full h-44 text-nmlText mb-10 rounded-lg"
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                      />

                      {errors.content && (
                        <div className="text-red-500 ml-1 text-nmlText font-medium">
                          {errors.content}
                        </div>
                      )}
                    </div>
                    {/* TagsInput component */}
                    <TagsInput
                      label="Primary Skills"
                      tags={primarySkills}
                      setTags={setPrimarySkills}
                      handleKeyDown={handleKeyDown}
                    />
                    <TagsInput
                      label="Good to Have Skills"
                      tags={goodToHaveSkills}
                      setTags={setGoodToHaveSkills}
                      handleKeyDown={handleKeyDown}
                    />
                  </div>

                  <div className="flex flex-row gap-8 items-center justify-center">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-400  font-semibold rounded-lg text-sm px-5 py-2.5 text-center "
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="text-white text-sm  inline-flex items-center bg-btnColor hover:bg-primary-hover  font-semibold rounded-lg  px-5 py-2.5 text-center"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddJobDescriptionModal;
