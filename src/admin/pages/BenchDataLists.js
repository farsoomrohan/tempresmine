//BenchDataLists.js
import React, { useCallback, useEffect, useState } from 'react'
import SidebarContainer from '../components/sidebarItem'
import HeaderAdmin from '../components/header'
import CustomTable from '../../utils/CustomTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../pages/scan/pagination'
import AxiosUtility from '../../utils/AxiosUtility'
import Swal from 'sweetalert2'

const BenchDataLists = ({ handleNetworkError }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [empTri, setEmpTri] = useState(false)
    const employeesPerPage = 5

    useEffect(() => {
        fetchBenchData()
    }, [handleNetworkError, empTri])

    const fetchBenchData = async () => {
        try {
            setLoading(true)
            const response = await AxiosUtility({
                url: 'https://resumeminingnodebe.azurewebsites.net/api/v1/employee/bench',
                method: 'GET',
                onNetworkError: handleNetworkError,
            })
            const mappedData = response.map((employee) => ({
                name: employee.name,
                email: employee.email,
                phone: employee.phone,
                skills: employee.skills,
                working_status: employee.working_status,
                organization_role: employee.organization_role,
                _id: employee._id, // need this for the rest of the API calls
            }))
            setData(mappedData)
            setTotalPages(Math.ceil(mappedData.length / employeesPerPage))
        } catch (error) {
            console.error('Error fetching bench data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * employeesPerPage
        const endIndex = startIndex + employeesPerPage
        return data.slice(startIndex, endIndex)
    }

    const TablePagination = () => (
        <Pagination
            nPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
    )

    const actions = [
        // (rowData) => ({
        //     icon: () => (
        //         <FontAwesomeIcon icon={faEdit} color="rgb(44 75 132)" size="xs" />
        //     ),
        //     tooltip: 'Edit',

        //     stickyHeader: true,
        // }),
        (rowData) => ({
            icon: () => (
                <FontAwesomeIcon icon={faTrash} color="red" size="xs" />
            ),
            tooltip: 'Delete',
            onClick: () => handleDelete(rowData), // Pass a function that calls handleDelete
            stickyHeader: true,
        }),
    ]

    const handleDelete = useCallback(async (rowData) => {
        let id = rowData?._id
        Swal.fire({
            title: 'Confirm Delete of Employee?',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: '#0f3374',
            cancelButtonColor: '#d32a2a',
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Employee Deleted',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500, // set the duration in milliseconds
                })
                setTimeout(async () => {
                    try {
                        const response = await AxiosUtility({
                            url: `https://resumeminingnodebe.azurewebsites.net/api/v1/employee/${id}`,
                            method: 'DELETE', // Assuming you want to delete the employee
                            onNetworkError: handleNetworkError,
                        })
                        console.log(response.data)
                        setEmpTri(!empTri)
                    } catch (error) {
                        console.error(error)
                    }
                }, 2000)
            }
        })
    }, [])

    return (
        <>
            <div className="flex h-screen">
                <SidebarContainer />
                <div className="flex flex-col flex-1">
                    <HeaderAdmin />
                    <div className="flex-1 p-8">
                        <label className="text-base text-textHeading font-bold ml-1">
                            Bench Employee List
                        </label>

                        <div className="mt-2">
                            <CustomTable
                                columns={columns}
                                data={getPaginatedData()}
                                actions={actions}
                                options={options}
                                loading={loading}
                                components={{
                                    Pagination: TablePagination,
                                }}
                            />
                            <div className="mt-4">
                                <TablePagination />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BenchDataLists

const columns = [
    {
        title: 'Name',
        field: 'name',
        render: (rowData) =>
            rowData.name && rowData.name.trim() !== '' ? (
                rowData.name
            ) : (
                <em>no info</em>
            ),
        cellStyle: {
            width: '150px',
            maxWidth: '150px',
        },
        headerStyle: {
            width: '150px',
            maxWidth: '150px',
        },
    },
    {
        title: 'Email',
        field: 'email',
        render: (rowData) => {
            const email = rowData.email || ''

            return (
                <div
                    style={{
                        width: 'auto',
                        maxWidth: '150px',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                    }}
                >
                    {email.trim() !== '' ? email : <em>no info</em>}
                </div>
            )
        },
        cellStyle: {
            width: 'auto',
            maxWidth: 'auto',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
        },
    },
    {
        title: 'Phone',
        field: 'phone',
        render: (rowData) =>
            rowData.phone && rowData.phone.trim() !== '' ? (
                rowData.phone
            ) : (
                <em>no info</em>
            ),
        cellStyle: {
            width: '150px',
            maxWidth: '150px',
        },
        headerStyle: {
            width: '150px',
            maxWidth: '150px',
        },
    },
    {
        title: 'Skills',
        field: 'skills',
        render: (rowData) => {
            const primarySkills = rowData.skills.slice(0, 3)
            return (
                <>
                    {primarySkills.map((skill, index) => (
                        <label
                            key={index}
                            className="inline-block text-nmlText px-2 py-1 mr-2 mb-2 rounded-md bg-gray-200"
                        >
                            {skill}
                        </label>
                    ))}
                </>
            )
        },
    },
    {
        title: 'Resume Summary',
        field: 'virtualFilePath',
        align: 'center',
        render: (rowData) => (
            <FontAwesomeIcon
                icon={faEye}
                size="lg"
                title="Preview"
                className="mr-5 cursor-pointer"
                style={{ color: '#2C4B84' }}
            />
        ),
        emptyValue: () => <em>no info</em>,
    },
    {
        title: 'Organization Role',
        field: 'organization_role',
        render: (rowData) =>
            rowData.organization_role &&
            rowData.organization_role.trim() !== '' ? (
                rowData.organization_role
            ) : (
                <em>no info</em>
            ),
        cellStyle: {
            width: '150px',
            maxWidth: '150px',
        },
        headerStyle: {
            width: '150px',
            maxWidth: '150px',
        },
    },
    {
        title: 'Working Status',
        field: 'working_status',
        render: (rowData) =>
            rowData.working_status && rowData.working_status.trim() !== '' ? (
                rowData.working_status
            ) : (
                <em>no info</em>
            ),
        cellStyle: {
            width: '150px',
            maxWidth: '150px',
        },
        headerStyle: {
            width: '150px',
            maxWidth: '150px',
        },
    },
]

const options = {
    search: false,
    paging: false,
    toolbar: false,
    filtering: false,
    detailPanelColumnAlignment: 'right',
    exportButton: false,
    exportAllData: false,
    pageSize: 5,
    pageSizeOptions: [20, 30, 50],
    rowStyle: (rowData, index) => ({
        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f2f2f2 ',
        borderBottom: '2px solid #1C72AE',
        borderTop: '2px solid #1C72AE',
    }),
    actionsColumnIndex: columns.length,
    searchOnEnter: true,
    debounceInterval: 500,
    stickyHeader: true,
    headerStyle: {
        fontWeight: 'bold',
        fontSize: '14px',
        background: 'rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: '0',
        fontFamily: 'Quicksand',
    },
    cellStyle: {
        fontSize: '14px',
        fontFamily: 'Quicksand',
        fontWeight: '500',
    },
    rowStyle: {
        fontSize: '14px',
        fontFamily: 'Quicksand',
    },
    maxBodyHeight: '68vh',
}
