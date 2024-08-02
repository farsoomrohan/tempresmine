import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AxiosUtility from "../../utils/AxiosUtility";
import PropTypes from "prop-types";
import { showSuccessToast } from "../../utils/toastUtility";

const FeedbackSection = ({ resumeData }) => {
  const feedbackReport = resumeData?.reports?.feedbackReport || {};

  const [value, setValue] = useState(5); //feedbackReport.rating
  const [feedbackText, setFeedbackText] = useState(""); //feedbackReport.feedbackDescription
  const { _id } = useParams();

  const url = process.env.REACT_APP_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (resumeData) {
      setValue(feedbackReport.rating);
      setFeedbackText(feedbackReport.feedbackDescription);
    }
  }, [resumeData]);

  const handleSubmit = async () => {
    try {
      const updatedFeedback = {
        rating: value,
        feedbackDescription: feedbackText,
      };

      const response = await AxiosUtility({
        url: `${url}/resume/feedback/${_id}`,
        method: "POST",
        data: updatedFeedback,
      });
      if (
        response.reports.feedbackReport.feedbackDescription === feedbackText
      ) {
        showSuccessToast("Thank you for your valuable feedback!");
        handleNavigate(response?.jdId);
      }
    } catch (error) {
      console.error("Error updating feedback:", error.message);
    }
  };

  const handleNavigate = (jdId) => {
    navigate(`/matched/resumeslist/${jdId}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // maxWidth: '1115px', Can be adjusted to match SkillsMatchReport component
      }}
      className="w-full"
    >
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#2C4B84",
          color: "white",
          padding: "15px",
          borderRadius: "8px 8px 0 0",
          textAlign: "left",
        }}
        className="font-quicksand font-bold"
      >
        Please Provide feedback for Report
      </Box>
      <Box
        sx={{
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "0 0 8px 8px",
          width: "100%",
          boxShadow: 3,
        }}
        className="font-quicksand"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Center horizontally
            alignItems: "center",
            gap: "20px", // Add some space between TextField and Rating
          }}
          className="font-quicksand"
        >
          <TextField
            label="Feedback"
            multiline
            rows={4}
            value={feedbackText}
            onChange={(event) => setFeedbackText(event.target.value)}
            variant="outlined"
            sx={{
              width: "70%", // Adjust width to make the TextField smaller
              "& .MuiInputLabel-root": { fontFamily: "QuickSand, sans-serif" },
              "& .MuiOutlinedInput-root": {
                fontFamily: "QuickSand, sans-serif",
              },
            }}
            className="font-quicksand"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className="font-quicksand"
          >
            Rating:
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{ textAlign: "center", marginTop: "20px" }}
          className="font-quicksand"
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2C4B84", color: "white" }}
            className="font-quicksand"
            onClick={handleSubmit}
          >
            SUBMIT
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

FeedbackSection.propTypes = {
  resumeData: PropTypes.object.isRequired,
  URL: PropTypes.string.isRequired,
};

export default FeedbackSection;
