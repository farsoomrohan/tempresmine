import React, { useState } from "react";
import MatchRate from "../../utils/MatchRate";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FirstSection({ resumeData }) {
  // Convert score from decimal to percentage
  const navigate = useNavigate();
  const { jdId } = useParams();
  const location = useLocation();
  const jdData = location?.state?.data;
  const [data, setData] = useState([]);
  const overallMatchScore = resumeData.normalizedScore
    ? parseFloat(resumeData.normalizedScore)
    : 0;
  const primarySkillScore = resumeData.skills.primary.score
    ? parseFloat(resumeData.skills.primary.score)
    : 0;
  const goodToHaveSkillScore = resumeData.skills.optional.score
    ? parseFloat(resumeData.skills.optional.score)
    : 0;

  return (
    <div className="container mx-auto mt-[-16px]">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="col-span-2 flex flex-col justify-center">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-nmlText">
                <strong>Name:</strong> {resumeData?.name}
              </p>
              <p className="text-nmlText">
                <strong>Contact No:</strong> {resumeData?.phone}
              </p>
            </div>
            <div>
              <p className="text-nmlText">
                <strong>Email-ID:</strong> {resumeData?.email}
              </p>
              <p className="text-nmlText">
                <strong>Experience:</strong> {resumeData?.experience} years
              </p>
            </div>
            <div>
              <p className="text-nmlText">
                <strong>Relevant Experience:</strong>{" "}
                {resumeData?.relevant_experience} years
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded"
            style={{ backgroundColor: "#2C4B84", borderRadius: "8px" }}
            onClick={() => {
              navigate(`/resumeSummary/${resumeData?._id}`);
            }}
          >
            View Resume Summary
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center "
          style={{ height: "260px" }}
        >
          <MatchRate score={overallMatchScore} />
        </div>
        <div
          className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto"
          style={{ height: "260px" }}
        >
          <h3
            className="font-bold text-center mb-4"
            style={{ color: "#2C4B84", fontSize: "14px" }}
          >
            Candidate Skill Match %
          </h3>
          <div className="mb-4">
            <h4 className="font-bold text-2C4B84">Primary Skills</h4>
            <div className="w-full">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${primarySkillScore}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
                <p className="text-nmlText">
                  {resumeData?.skills?.primary?.skills?.join(", ")}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-bold text-2C4B84">Good to Have Skills</h4>
            <div className="w-full">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${goodToHaveSkillScore}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
                <label className="text-nmlText">
                  {resumeData?.skills?.optional?.skills.join(", ")}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstSection;
