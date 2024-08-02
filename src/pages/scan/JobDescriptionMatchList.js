import React, { useCallback, useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import FilterableList from "../../components/FilterableList";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faCircleCheck,
  faCircleXmark,
  faFilePdf,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAngleLeft,
  faChartPie,
  faCircleInfo,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import CustomTable from "../../utils/CustomTable";
import AxiosUtility from "../../utils/AxiosUtility";
import Pagination from "./pagination";
import moment from "moment";
import { debounce } from "../../utils/utils";
import { getToken, decodeToken } from "../../utils/auth";
import { isAdmin } from "../../utils/roles";
import { showSuccessToast } from "../../utils/toastUtility";

export default function JobDescriptionMatchList({ handleNetworkError }) {
  const { jdId } = useParams();
  const [jdData, setJdData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [tableActionTrigger, setTableActionTrigger] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const url = `${process.env.REACT_APP_URL}`;
  const [resumeStatus, setResumeStatus] = useState("NEW");

  const [searchText, setSearchText] = useState("");

  const token = getToken();
  const user = decodeToken(token);

  // debounce function
  const debouncedSearch = useCallback(
    debounce((value, resumeStatus) => {
      if (value) {
        fetchSearchResults(value, 1, resumeStatus); // Reset to first page on search
      } else if (value === "" || value === undefined || value === null) {
        // console.log(jdId);
        setTableActionTrigger(!tableActionTrigger);
      }
    }, 300),
    []
  );

  // handlechange function for search text
  const handleSearch = (search) => {
    if (search && search.length > 0 && search !== "") {
      setSearchText(search);
      debouncedSearch(search, resumeStatus);
    } else {
      setSearchText("");
      setSearchData(data);
      debouncedSearch(null);
    }
  };

  // search API call
  const fetchSearchResults = async (search, pageNumber, resumeStatus) => {
    setIsLoading(true);
    try {
      const responseBody = {
        search,
        page: pageNumber,
        status: resumeStatus,
      };

      const response = await AxiosUtility({
        url: `${url}/resume/searchResumeList/${jdId}?search=${search}&status=${resumeStatus}&page=${pageNumber}`,
        method: "POST",
        // data: responseBody,
        onNetworkError: handleNetworkError,
      });

      if (response) {
        setSearchData(response?.resumes?.items);
        setTotalPages(response?.resumes?.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (jdId) {
      fetchData(jdId, currentPage, resumeStatus);
    }
  }, [jdId, currentPage, tableActionTrigger, resumeStatus]);

  useEffect(() => {
    setSearchData(data);
  }, [data]);

  const fetchData = async (jdId, currentPage, resumeStatus) => {
    setIsLoading(true);
    try {
      const response1 = await AxiosUtility({
        url: `${url}/job-details/getSingleJobDetail/${jdId}`,
        method: "GET",
        onNetworkError: handleNetworkError,
      });

      if (response1) {
        setJdData(response1);
      }

      // console.log(response, "upload");
      const response2 = await AxiosUtility({
        url: `${url}/resume/resumeListbyJD/${jdId}?page=${currentPage}&status=${resumeStatus}`,
        method: "GET",
        onNetworkError: handleNetworkError,
      });

      if (response2) {
        setData(response2?.resumes?.items);
        setTotalPages(response2?.resumes?.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setSearchText("");
    setResumeStatus(filter);
  };

  const columns = [
    {
      title: "Name",
      field: "name",
      render: (rowData) =>
        rowData.name && rowData.name.trim() !== "" ? (
          rowData.name
        ) : (
          <em>no info</em>
        ),
      cellStyle: {
        width: "150px",
        maxWidth: "150px",
      },
      headerStyle: {
        width: "150px",
        maxWidth: "150px",
      },
    },
    {
      title: "Email",
      field: "email",
      render: (rowData) => {
        const email = rowData.email || "";

        return (
          <div
            style={{
              width: "auto",
              maxWidth: "150px",
              wordWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            {email.trim() !== "" ? email : <em>no info</em>}
          </div>
        );
      },
      cellStyle: {
        width: "auto",
        maxWidth: "auto",
        whiteSpace: "normal",
        wordWrap: "break-word",
      },
    },
    {
      title: "Phone",
      field: "phone",
      render: (rowData) =>
        rowData.phone && rowData.phone.trim() !== "" ? (
          rowData.phone
        ) : (
          <em>no info</em>
        ),
      cellStyle: {
        width: "150px",
        maxWidth: "150px",
      },
      headerStyle: {
        width: "150px",
        maxWidth: "150px",
      },
    },
    {
      title: "Skills",
      field: "skills",
      render: (rowData) => {
        const primarySkills = rowData.skills.primary.skills.slice(0, 3); // Directly slicing the array
        return (
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            {primarySkills.map((skill, index) => (
              <li key={index} className="text-xs">
                {skill}
              </li>
            ))}
          </ul>
        );
      },

      emptyValue: () => <em>no info</em>,
      cellStyle: {
        width: "200px",
        maxWidth: "200px",
      },
      headerStyle: {
        width: "200px",
        maxWidth: "200px",
      },
    },
    {
      title: "Matching%",
      field: "normalizedScore",
      align: "center",
      render: (rowData) =>
        rowData.normalizedScore !== undefined ? (
          `${rowData.normalizedScore}%`
        ) : (
          <em>no info</em>
        ),
      cellStyle: {
        width: "100px",
        textAlign: "left",
      },
      headerStyle: {
        width: "100px",
        textAlign: "left",
      },
    },
    {
      title: "Experience",
      field: "experience",
      emptyValue: () => <em>no info</em>,
      cellStyle: {
        width: "50px",
        textAlign: "left",
        paddingLeft: "50px",
      },
      headerStyle: {
        width: "50px",
        textAlign: "left",
      },
    },
    {
      title: "Last Scanned Time",
      field: "updatedAt",
      render: (rowData) => (
        <div className="lastScan">
          {moment(rowData.updatedAt).format("YYYY-MM-DD")} |{" "}
          {moment(rowData.updatedAt).format("hh:mm A")}
        </div>
      ),
      emptyValue: () => <em>no info</em>,
      cellStyle: {
        width: "250px",
        maxWidth: "250px",
      },
      headerStyle: {
        width: "270px",
        maxWidth: "270px",
      },
    },
    {
      title: "Resume Summary",
      field: "virtualFilePath",
      align: "center",
      render: (rowData) => (
        <FontAwesomeIcon
          icon={faEye}
          size="lg"
          title="Preview"
          className="mr-5 cursor-pointer"
          style={{ color: "#007196" }}
          onClick={() =>
            navigate(`/resumeSummary/${rowData._id}`, { state: { jdId: jdId } })
          }
        />
      ),
      emptyValue: () => <em>no info</em>,
      cellStyle: {
        textAlign: "center",
        width: "150px",
        maxWidth: "150px",
      },
      headerStyle: {
        textAlign: "center",
        width: "150px",
        maxWidth: "150px",
      },
    },
  ];

  const actions = [
    (rowData) => ({
      icon: () => (
        <FontAwesomeIcon icon={faChartPie} color="rgb(44 75 132)" size="xs" />
      ),
      tooltip: "View Detailed Analysis",
      onClick: (event, rowData) => {
        navigate(`/resumeAnalysisReport/${rowData._id}`);
      },
      stickyHeader: true,
    }),

    isAdmin(user) &&
      ((rowData) => ({
        icon: () =>
          rowData.status === "ACCEPTED" ? (
            <FontAwesomeIcon icon={faCircleCheck} color="gray" size="xs" />
          ) : (
            <FontAwesomeIcon icon={faCircleCheck} color="green" size="xs" />
          ),
        tooltip: rowData.status === "ACCEPTED" ? "Accepted" : "Accept",
        onClick: (event, rowData) => {
          if (
            rowData.status === "NEW" ||
            rowData.status === "REJECTED" ||
            rowData.status === null
          ) {
            let status = "ACCEPTED";
            handleActions(rowData, status);
          }
        },
        stickyHeader: true,
      })),
    isAdmin(user) &&
      ((rowData) => ({
        icon: () =>
          rowData.status === "REJECTED" ? (
            <FontAwesomeIcon icon={faCircleXmark} color="gray" size="xs" />
          ) : (
            <FontAwesomeIcon icon={faCircleXmark} color="red" size="xs" />
          ),
        tooltip: rowData.status === "REJECTED" ? "Rejected" : "Reject",
        onClick: (event, rowData) => {
          if (
            rowData.status === "NEW" ||
            rowData.status === "ACCEPTED" ||
            rowData.status === null
          ) {
            let status = "REJECTED";
            handleActions(rowData, status);
          }
        },
        stickyHeader: true,
      })),
    {
      icon: () => (
        <FontAwesomeIcon
          icon={faFilePdf}
          style={{ color: "#007196" }}
          size="xs"
        />
      ),
      tooltip: "View",
      stickyHeader: true,
      onClick: (event, rowData) => {
        const url = `${process.env.REACT_APP_URL}/getFiles/${rowData.virtualFilePath}`;
        window.open(url, "_blank");
        setOpenPopUp(true);
        setSelectedRow(rowData);
      },
    },
  ];

  const options = {
    search: false,
    paging: true,
    toolbar: false,
    filtering: false,
    detailPanelColumnAlignment: "right",
    exportButton: false,
    exportAllData: false,
    pageSize: 6,
    pageSizeOptions: [20, 30, 50],
    rowStyle: (rowData, index) => ({
      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f2f2 ",
      borderBottom: "2px solid #1C72AE",
      borderTop: "2px solid #1C72AE",
    }),
    actionsColumnIndex: columns.length,
    searchOnEnter: true,
    debounceInterval: 500,
    stickyHeader: true,
    headerStyle: {
      fontWeight: "bold",
      fontSize: "14px",
      background: "rgba(0, 0, 0, 0.05)",
      position: "sticky",
      top: "0",
      fontFamily: "Quicksand",
    },
    cellStyle: {
      fontSize: "14px",
      fontFamily: "Quicksand",
      fontWeight: "500",
    },
    rowStyle: {
      fontSize: "14px",
      fontFamily: "Quicksand",
    },
    maxBodyHeight: "68vh",
  };

  const handleActions = async (rowData, status) => {
    try {
      let id = rowData?._id;
      setTableActionTrigger(!tableActionTrigger);
      let resBody = {
        status: status,
      };

      const response = await AxiosUtility({
        url: `${url}/resume/updateResumeDetails/${id}`,
        method: "PATCH",
        data: resBody,
        onNetworkError: handleNetworkError,
      });

      if (response?.status === "ACCEPTED") {
        showSuccessToast("Resume accepted successfully!");
      } else if (response?.status === "REJECTED") {
        handleDelete(response?._id);
        showSuccessToast("Resume rejected!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await AxiosUtility({
        url: `${url}/resume/${id}`,
        method: "DELETE",
        onNetworkError: handleNetworkError,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleScanResumes = async () => {
    setIsLoading(true);
    try {
      await AxiosUtility({
        url: `${url}/resume/scan/${jdId}?page=${currentPage}`,
        method: "GET",
        onNetworkError: handleNetworkError,
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="relative">
        <div className="relative container mx-auto py-4">
          <div className="px-10">
            <div className="flex flex-row justify-between my-2">
              <div className="flex flex-row items-center gap-2">
                <button
                  type="button"
                  // onClick={handleBack}
                  onClick={() => {
                    navigate(`/upload/resumes/${jdData?.jobDetail?._id}`);
                  }}
                  className="flex flex-row px-1 py-1 text-sm text-gray-700 transition-colors bg-white border rounded-lg sm:w-auto hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faAngleLeft} className="w-4 h-4" />
                </button>
                <h1 className="text-base text-textHeading font-bold">
                  {isLoading
                    ? "Loading..."
                    : `Uploaded Resume List - ${jdData?.jobDetail?.jobTitle}`}
                </h1>{" "}
                {/* removed paragraph tags causing problems */}
              </div>

              <div className="flex flex-row">
                <span className="mr-2 items-center content-center justify-center text-md">
                  Filter by Resume Status
                </span>
                <div className="relative  mr-1 mb-2 md:mb-0 flex items-center justify-end">
                  <FilterableList
                    // data={resumesfiltermock}
                    filterOptions={["ALL", "ACCEPTED", "NEW", "REJECTED"]}
                    filterKey="status"
                    onFilterChange={handleFilterChange}
                    defaultValue="NEW"
                  />
                </div>
                <div className="relative w-full md:w-64 mr-1 mb-2 md:mb-0">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon
                      icon={faSearch}
                      style={{ color: "#c3c6d1" }}
                    />
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="w-full h-9 p-5 pl-10 pr-6 text-sm text-gray-900 border border-gray-300 rounded-lg shadow-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {searchText && (
                    <button
                      className="absolute inset-y-0 right-0 flex items-center pr-2 focus:outline-none "
                      onClick={() => handleSearch("")}
                    >
                      <FontAwesomeIcon
                        icon={faTimes}
                        style={{ color: "#494646" }}
                      />
                    </button>
                  )}
                </div>
                <span className="items-center justify-center content-center mr-4 cursor-pointer">
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    size="xl"
                    title="You can search for name, email, skills, phone number"
                    style={{ color: "#2C4B84" }}
                  />
                </span>
                <button
                  onClick={handleScanResumes}
                  className="text-sm font-semibold bg-btnColor  hover:bg-btnHover px-6 py-2 text-white rounded-lg"
                >
                  Scan
                </button>
              </div>
            </div>

            <div className="mt-2">
              <CustomTable
                columns={columns}
                title="Match Reports"
                options={options}
                data={searchData} //can include filteredData to be passed here, convert data to an array
                actions={actions}
                isLoading={isLoading}
                components={{
                  Pagination: (props) => (
                    <Pagination
                      nPages={totalPages}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
