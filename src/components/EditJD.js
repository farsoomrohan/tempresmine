import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TagsInput from "./TagsInput";
import Axios from "axios";
import Swal from "sweetalert2";
import AxiosUtility from "../utils/AxiosUtility";
import { TextField } from "@material-ui/core";

function EditJobDescriptionModal({
  editOpen,
  setEditOpen,
  editItem,
  updatedJD,
  handleNetworkError,
}) {
  const [content, setContent] = useState(
    editItem ? editItem.jobDescription : ""
  );
  const [clientName, setClientName] = useState(
    editItem ? editItem.clientName : ""
  );
  const [jobTitle, setJobTitle] = useState(editItem ? editItem.jobTitle : "");

  const [primarySkills, setPrimarySkills] = useState(
    editItem ? editItem.primarySkills : []
  );

  const [goodToHaveSkills, setGoodToHaveSkills] = useState(
    editItem ? editItem.goodToHaveSkills : []
  );
  const [minExperience, setMinExperience] = useState(
    editItem ? editItem.minExpRequired : ""
  );
  const [maxExperience, setMaxExperience] = useState(
    editItem ? editItem.maxExpRequired : ""
  );

  const [errors, setErrors] = useState({});
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
    setEditOpen(!editOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const updateSuccessMessage = async () => {
    Swal.fire({
      title: "JD updated Successfully!",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });

    toggleModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault(false);
    const isValid = validate();
    let _id = editItem._id;

    const updateFormData = {
      clientName: clientName,
      jobTitle: jobTitle,
      jobDescription: content,
      primarySkills: primarySkills,
      goodToHaveSkills: goodToHaveSkills,
      minExpRequired: parseInt(minExperience, 10),
      maxExpRequired: parseInt(maxExperience, 10),
    };
    if (isValid) {
      try {
        const response = await AxiosUtility({
          url: `${url}/job-details/updateJobDetails/${_id}`,
          method: "PATCH",
          data: updateFormData,
          onNetworkError: handleNetworkError,
        });
        if (response?.message === "Job Details updated successfully.") {
          updatedJD();
          updateSuccessMessage();
        }
      } catch (error) {
        alert(error.message);
      }
    }
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

    if (!minExperience) {
      newErrors.minExperience = "Minimum experince required";
    }

    if (!maxExperience) {
      newErrors.maxExperience = "Maximum experince required";
    }

    if (
      minExperience &&
      maxExperience &&
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
      {editOpen && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-[40rem] overflow-y-scroll  ">
            <div className="relative bg-white rounded-lg shadow ">
              <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t ">
                <h3 className="text-base font-bold text-textHeading">
                  Edit Job Description
                </h3>
                <button
                  onClick={toggleModal}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
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
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="flex flex-row justify-between gap-4">
                    <div className="col-span-2">
                      <TextField
                        label="Client Name"
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
                        name="clientName"
                        id="clientName"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-nmlText rounded-lg block w-[360px] p-[10px] "
                        placeholder="Client Name"
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
                          label="Min"
                          variant="outlined"
                          name="maxExperience"
                          InputProps={{
                            style: {
                              fontSize: "14px",
                              fontFamily: "Quicksand, sans-serif",
                              color: "#000929",
                            },
                          }}
                          type="text"
                          size="small"
                          id="minExperience"
                          value={minExperience}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(
                              /[^0-9]/g,
                              ""
                            );
                            setMinExperience(numericValue);
                          }}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-nmlText rounded-lg block w-24 p-[10px] "
                          required
                        />
                      </div>
                      <div>
                        <TextField
                          label="Max"
                          variant="outlined"
                          name="maxExperience"
                          type="text"
                          InputProps={{
                            style: {
                              fontSize: "14px",
                              fontFamily: "Quicksand, sans-serif",
                              color: "#000929",
                            },
                          }}
                          size="small"
                          id="maxExperience"
                          value={maxExperience}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(
                              /[^0-9]/g,
                              ""
                            );
                            setMaxExperience(numericValue);
                          }}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-nmlText rounded-lg block w-24  p-[10px]"
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
                      size="small"
                      InputProps={{
                        style: {
                          fontSize: "14px",
                          fontFamily: "Quicksand, sans-serif",
                          color: "#000929",
                        },
                      }}
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
                      <div className="text-red-500 ml-1 text-nmlText font-medium">
                        {errors.jobTitle}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="jobDescription"
                      className="block mb-2 text-nmlText font-semibold text-textHeading "
                    >
                      Job Description
                    </label>
                    <ReactQuill
                      className="w-full h-44 text-nmlText mb-10 rounded-lg"
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                    />{" "}
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

                  {/* <TagsInput
                    label="Secondary Skills"
                    tags={secondarySkills}
                    setTags={setSecondarySkills}
                    handleKeyDown={handleKeyDown}
                  /> */}
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
                    className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-400  font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="text-white inline-flex items-center bg-btnColor hover:bg-btnHover  font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditJobDescriptionModal;
