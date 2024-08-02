import axios from "axios";

const AxiosUtility = async ({
  url,
  method,
  data = null,
  params = null,
  fileUpload = false,
  onNetworkError = null,
}) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": fileUpload ? "multipart/form-data" : "application/json",
  };

  try {
    let finalData = fileUpload ? data : null;
    if (!fileUpload && data) {
      finalData = data; // Send JSON data directly
    }
    const response = await axios({
      url,
      method,
      headers,
      data: finalData,
      params,
    });

    return response.data;
  } catch (error) {
    console.error(error);

    if (error.message === "Network Error" && onNetworkError) {
      onNetworkError();
    }

    throw error;
  }
};

export default AxiosUtility;
