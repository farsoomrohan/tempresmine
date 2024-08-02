import React, { useEffect, useState, useCallback } from 'react'
import AddJobDescriptionModal from '../components/AddJobDescriptionModal'
import FilterableList from '../components/FilterableList'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import EditJobDescriptionModal from '../components/EditJD'
import Swal from 'sweetalert2'
import { debounce } from '../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCircleInfo,
    faPen,
    faSearch,
    faTimes,
    faTrash,
} from '@fortawesome/free-solid-svg-icons'
import AxiosUtility from '../utils/AxiosUtility'
import Pagination from '../utils/Pagination'
import { getToken, decodeToken } from '../utils/auth'
import { isAdmin } from '../utils/roles'

function JobCardViewList({ handleNetworkError }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [data, setData] = useState([])
    const [renderedData, setRenderedData] = useState([])
    const [jobDetailsTrigger, setJobDetailsTrigger] = useState(false)
    const [totalItems, setTotalItems] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [editItem, setEditItem] = useState()
    const [searchText, setSearchText] = useState('')
    const [updatedJD, setUpdatedJD] = useState(false)
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState({})
    const url = `${process.env.REACT_APP_URL}`
    const [jdStatus, setJdStatus] = useState('ACTIVE')

    const token = getToken()
    const user = decodeToken(token)

    const toggleExpand = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    // debounce function
    const debouncedSearch = useCallback(
        debounce((value, jdStatus) => {
            if (value) {
                fetchSearchResults(value, 1, jdStatus) // Reset to first page on search
            } else if (value === '' || value === undefined || value === null) {
                setJobDetailsTrigger(!jobDetailsTrigger)
            }
        }, 300),
        []
    )

    // handlechange function for search text
    const handleSearch = (search) => {
        if (search && search.length > 0 && search !== '') {
            setSearchText(search)
            debouncedSearch(search, jdStatus)
        } else {
            setSearchText('')
            setRenderedData(data)
            debouncedSearch(null)
            // fetchJD(1); // Reset to first page when search is cleared
        }
    }

    // search API call
    const fetchSearchResults = async (search, pageNumber, jdStatus) => {
        setIsLoading(true)
        try {
            const responseBody = {
                search,
                page: pageNumber,
                status: jdStatus,
            }

            const response = await AxiosUtility({
                url: `${url}/job-details/search`,
                method: 'POST',
                data: responseBody,
            })

            const { jobDetails } = response
            if (jobDetails) {
                setRenderedData(jobDetails.items)
                setTotalItems(jobDetails.totalItems)
                setTotalPages(jobDetails.totalPages)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchJD = async (pageNumber, status) => {
        setIsLoading(true)
        try {
            const response = await AxiosUtility({
                url: `${url}/job-details/getJobDetails?page=${pageNumber}&status=${status}`,
                method: 'GET',
                onNetworkError: handleNetworkError,
            })
            const { jobDetails } = response

            if (jobDetails) {
                setData(jobDetails.items)
                setTotalItems(jobDetails.totalItems)
                setTotalPages(jobDetails.totalPages)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFilterChange = (filter) => {
        setSearchText('')
        setJdStatus(filter)
    }

    const fetchJdOnUpdate = async () => {
        setUpdatedJD(true)
    }

    // Get API for display Job Titles
    useEffect(() => {
        fetchJD(currentPage, jdStatus)
    }, [currentPage, updatedJD, jobDetailsTrigger, jdStatus])

    useEffect(() => {
        setRenderedData(data)
    }, [data])

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const toggleModal1 = () => {
        setEditOpen(!editOpen)
    }

    const handleScanView = (data) => {
        if (data.status === 'DELETED') {
            handlePatchActions(data)
        } else {
            navigate(`/upload/resumes/${data?._id}`)
        }
    }

    const handlePatchActions = async (data) => {
        Swal.fire({
            title: `${
                data?.status === 'DELETED'
                    ? 'Confirm Restore?'
                    : 'Confirm Delete?'
            }`,
            text: "Note: JD's marked as deleted will be removed after 30 days, along with the resume's associated with it.There is an option to restore the JD and resumes, if its done within the 30 day window.",
            showCancelButton: true,
            confirmButtonText: `Confirm`,
            confirmButtonColor: '#0f3374',
            cancelButtonColor: '#d32a2a',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: `${
                        data?.status === 'DELETED'
                            ? 'Restored Successfully!'
                            : 'Deleted Successfully!'
                    }`,
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                })
                try {
                    const resBody = {
                        status: `${
                            data?.status === 'DELETED' ? 'ACTIVE' : 'DELETED'
                        }`,
                    }

                    AxiosUtility({
                        url: `${url}/job-details/updateJobDetails/${data?._id}`,
                        method: 'PATCH',
                        data: resBody,
                    })
                    setJobDetailsTrigger(!jobDetailsTrigger)
                } catch (error) {
                    alert(error.message)
                }
            }
        })
    }

    return (
        <>
            <ul className="rounded-md px-4 md:px-0">
                <div className="flex flex-col md:flex-row md:justify-between">
                    <h3 className="text-textHeading text-xl font-bold">
                        Job Listings
                    </h3>
                    <div className="flex flex-col md:flex-row justify-between mt-4 md:mt-0">
                        <div className="relative w-full md:w-64 mr-1 mb-2 md:mb-0 flex items-center justify-end">
                            <span className="mr-2 text-md">
                                Filter by Status
                            </span>
                            <FilterableList
                                // data={jobdescriptionsfiltermock}
                                filterOptions={['ALL', 'ACTIVE', 'DELETED']}
                                filterKey="status"
                                onFilterChange={handleFilterChange}
                                defaultValue="ACTIVE"
                            />
                        </div>
                        <div className="relative w-full md:w-64 mr-1 mb-2 md:mb-0">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    style={{ color: '#c3c6d1' }}
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
                                    className="absolute inset-y-0 right-0 flex items-center pr-2 pb-2 focus:outline-none"
                                    onClick={() => handleSearch('')}
                                >
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        style={{ color: '#494646' }}
                                    />
                                </button>
                            )}
                        </div>
                        <span className="items-center justify-center content-center mr-4 cursor-pointer">
                            <FontAwesomeIcon
                                icon={faCircleInfo}
                                size="xl"
                                title="Search by Client Name and Job Title"
                                style={{ color: '#2C4B84' }}
                            />
                        </span>

                        {isAdmin(user) && (
                            <button
                                onClick={toggleModal}
                                type="button"
                                className="focus:outline-none font-semibold text-white bg-btnColor hover:bg-btnHover rounded-lg text-sm px-3 py-2 md:px-4 md:py-2 me-2 mb-2 md:mb-0 "
                            >
                                Add New JD
                            </button>
                        )}
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
                    <>
                        <div className="flex flex-col">
                            {/* Header */}
                            <div className="flex flex-row justify-between items-center px-6 mt-4">
                                <div className="w-[100px]">
                                    <p className="text-base font-bold leading-6 text-textHeading">
                                        Client Name
                                    </p>
                                </div>
                                <div className="w-full md:w-60">
                                    <p className="text-base font-bold leading-6 text-textHeading">
                                        Job Title
                                    </p>
                                </div>
                                <div className="w-full md:w-auto">
                                    <p className="text-base font-bold leading-6 text-textHeading">
                                        Last Updated
                                    </p>
                                </div>
                                {isAdmin(user) && (
                                    <div className="w-full md:w-auto mr-16">
                                        <p className="text-base font-bold leading-6 text-textHeading">
                                            Actions
                                        </p>
                                    </div>
                                )}
                                <div className="w-full md:w-auto mr-32">
                                    <p className="text-base font-bold leading-6 text-textHeading">
                                        Add Resume
                                    </p>
                                </div>
                            </div>
                        </div>

                        {renderedData.length === 0 ? (
                            <div className="text-center text-gray-500 my-8">
                                No job details available
                            </div>
                        ) : (
                            <>
                                {renderedData.map((person) => (
                                    <li
                                        key={person._id}
                                        className="flex flex-col md:flex-row justify-between items-center shadow-xl bg-white rounded-lg px-6 py-4 mt-4"
                                    >
                                        <div className="flex flex-col md:flex-row min-w-0 w-[100px]">
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-nmlText font-bold leading-6 text-normalText w-full md:w-64">
                                                    {expanded[person._id] ? (
                                                        <>{person.clientName}</>
                                                    ) : (
                                                        <>
                                                            {person.clientName
                                                                .length > 25
                                                                ? `${person.clientName.substring(
                                                                      0,
                                                                      25
                                                                  )}...`
                                                                : person.clientName}
                                                            {person.clientName
                                                                .length >
                                                                25 && (
                                                                <button
                                                                    className="text-blue-500 cursor-pointer ml-1"
                                                                    onClick={() =>
                                                                        toggleExpand(
                                                                            person._id
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        ' see more'
                                                                    }
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </p>
                                                <p className="text-blue-500 text-nmlText font-medium">
                                                    #{person.clientId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row min-w-0 w-full md:w-64 mt-4 md:mt-0">
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-nmlText font-medium leading-6 text-normalText w-full md:w-64">
                                                    {expanded[person._id] ? (
                                                        <>
                                                            {person.jobTitle}
                                                            <button
                                                                className="text-blue-500 cursor-pointer ml-1"
                                                                onClick={() =>
                                                                    toggleExpand(
                                                                        person._id
                                                                    )
                                                                }
                                                            >
                                                                {' see less'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {person.jobTitle
                                                                .length > 20
                                                                ? `${person.jobTitle.substring(
                                                                      0,
                                                                      20
                                                                  )}...`
                                                                : person.jobTitle}
                                                            {person.jobTitle
                                                                .length >
                                                                20 && (
                                                                <button
                                                                    className="text-blue-500 cursor-pointer ml-1"
                                                                    onClick={() =>
                                                                        toggleExpand(
                                                                            person._id
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        ' see more'
                                                                    }
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row min-w-0 w-full md:w-auto mt-4 md:mt-0">
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-nmlText font-medium leading-6 text-normalText">
                                                    {moment(
                                                        person.updatedAt
                                                    ).format('DD-MM-YYYY')}
                                                </p>
                                            </div>
                                        </div>

                                        {isAdmin(user) && (
                                            <div className="flex flex-col md:flex-row min-w-0 w-full md:w-auto mt-4 md:mt-0 gap-4">
                                                <div className="text-[#10925B] text-sm font-semibold leading-6 md:mr-4 mb-2 md:mb-0">
                                                    <button
                                                        disabled={
                                                            person?.status ===
                                                            'DELETED'
                                                        }
                                                        onClick={() => {
                                                            setEditItem(person)
                                                            toggleModal1()
                                                        }}
                                                        className={`${
                                                            person?.status ===
                                                            'DELETED'
                                                                ? 'cursor-not-allowed '
                                                                : ''
                                                        }`}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPen}
                                                            size="lg"
                                                            color={`${
                                                                person?.status ===
                                                                'DELETED'
                                                                    ? 'gray '
                                                                    : 'black'
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                                <div className="text-[#FF3131] text-sm font-semibold leading-6">
                                                    <button
                                                        disabled={
                                                            person?.status ===
                                                            'DELETED'
                                                        }
                                                        className={`${
                                                            person?.status ===
                                                            'DELETED'
                                                                ? 'cursor-not-allowed '
                                                                : ''
                                                        }`}
                                                        onClick={() =>
                                                            handlePatchActions(
                                                                person
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                            size="lg"
                                                            color={`${
                                                                person?.status ===
                                                                'DELETED'
                                                                    ? 'gray '
                                                                    : 'red'
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex flex-col md:flex-row gap-4 min-w-0 w-full md:w-auto mt-4 md:mt-0">
                                            <button
                                                disabled={
                                                    person?.status === 'DELETED'
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/matched/resumeslist/${person?._id}`
                                                    )
                                                }
                                                className={`${
                                                    person?.status === 'DELETED'
                                                        ? 'cursor-not-allowed bg-[gray]  text-white rounded-lg px-4 py-2 '
                                                        : 'bg-white border-2 border-textHeading text-textHeading mt-2 md:mt-0 md:ml-4 w-[120px] text-sm font-semibold leading-6 rounded-lg px-4 py-2transition duration-300 ease-in-out hover:font-bold'
                                                }`}
                                            >
                                                Resume List
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleScanView(person)
                                                }
                                                className="mt-2 md:mt-0 md:ml-4 w-[120px] text-sm font-semibold leading-6 border bg-textHeading rounded-lg px-4 py-2 text-white transition duration-300 ease-in-out hover:font-bold"
                                            >
                                                {person?.status === 'DELETED'
                                                    ? 'Restore'
                                                    : 'Add Resume'}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </>
                        )}
                    </>
                )}
            </ul>
            <Pagination
                nPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                loading={isLoading}
            />

            {isOpen && (
                <AddJobDescriptionModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    toggleModal={toggleModal}
                    updatedJD={fetchJdOnUpdate}
                    handleNetworkError={handleNetworkError}
                />
            )}
            {editOpen && (
                <EditJobDescriptionModal
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    editItem={editItem}
                    handleNetworkError={handleNetworkError}
                    updatedJD={fetchJdOnUpdate}
                />
            )}
        </>
    )
}

export default JobCardViewList
