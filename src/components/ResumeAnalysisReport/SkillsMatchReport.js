import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

const SkillsMatchReport = ({ resumeData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockData = {
    primarySkills: [
      { name: ".Net", isMatch: true },
      { name: "C Sharp", isMatch: false },
      { name: "Java", isMatch: true },
      { name: "React", isMatch: false },
      { name: "NodeJS", isMatch: false },
      { name: "AWS", isMatch: true },
    ],
    goodToHaveSkills: [
      { name: "FullStack", isMatch: false },
      { name: "SQL", isMatch: false },
      { name: "MongoDB", isMatch: true },
    ],
    summary:
      "Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary Sample Summary",
  };

  useEffect(() => {
    if (resumeData) {
      //replace mockData with resumeData when API call is ready
      setData(resumeData.reports.skill_report); //replace mockData with resumeData.report.skill_report when API call is ready
      setLoading(false);
    } else {
      setData(mockData);
      setLoading(false);
      setError("Resume data not available");
    }
  }, [resumeData]); //replace mockData with resumeData when API call is ready

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.warn("Using mock data due to error:", error);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        // maxWidth: '1115px', Can be adjusted to match SkillsMatchReport component
      }}
      className="w-full"
    >
      {/*<div className="p-4 bg-white rounded-lg w-full shadow-md flex flex-col">*/}
      {/*<div className="bg-[#2C4B84] text-white py-3 px-5 rounded-t-lg text-left font-quicksand font-bold">
               Skills Match Report
           </div>*/}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#2C4B84",
          color: "white",
          padding: "15px",
          borderRadius: "8px 8px 0 0",
          textAlign: "left",
        }}
        className="font-bold"
      >
        Job Description Skill Match Report
      </Box>
      <div className="flex justify-end space-x-4">
        <div className="flex items-center space-x-2 p-4">
          <span className="font-quicksand">Missing Skills</span>
          <span className="inline-block w-5 h-5 bg-[#D9D9D9]"></span>
        </div>
        <div className="flex items-center space-x-2 p-4">
          <span className="font-quicksand">Matching Skills</span>
          <span className="inline-block w-5 h-5 bg-[#9FE786]"></span>
        </div>
      </div>
      <div className=" p-4">
        <div className="font-quicksand mr-8 flex items-center">
          <label className=" text-normalText text-base font-semibold">
            Primary Skills
          </label>
          <div className="flex ml-[8%]">
            {data.primarySkills.map((skill, index) => (
              <div
                key={index}
                className={`px-3 py-1 m-1 rounded ${
                  skill?.isMatched
                    ? "bg-[#9FE786] text-black"
                    : "bg-[#D9D9D9] text-black"
                }`}
              >
                {skill?.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" p-4">
        <div className="mr-8 flex items-center">
          <label className=" text-normalText text-base font-semibold ">
            Good To Have Skills
          </label>
          <div className="flex ml-[5%]">
            {data?.optionalSkills?.map((skill, index) => (
              <div
                key={index}
                className={`px-3 py-1 m-1 rounded ${
                  skill.isMatched
                    ? "bg-[#9FE786] text-black"
                    : "bg-[#D9D9D9] text-black"
                }`}
              >
                {skill?.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4">
        <label className=" mb-2 text-normalText text-base font-semibold">
          Candidate Summary
        </label>
        <div className="max-h-32 overflow-y-auto border p-3 rounded">
          <p className="font-quicksand text-gray-700">
            {resumeData?.candidate_summary}
          </p>
        </div>
      </div>
    </Box>
  );
};

SkillsMatchReport.propTypes = {
  resumeData: PropTypes.object,
};

export default SkillsMatchReport;
