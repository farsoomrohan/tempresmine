//AdminDashboard.js
import React, { useState, useEffect } from 'react'
import SidebarContainer from '../components/sidebarItem'
import HeaderAdmin from '../components/header'
import { TextField, Select, MenuItem, Switch } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUsers,
    faFileAlt,
    faUserTie,
    faTrash,
} from '@fortawesome/free-solid-svg-icons'
import globeBackground from '../../images/bgimg.png'
import AxiosUtility from '../../utils/AxiosUtility'
import Pagination from '../../utils/Pagination'
import { getToken, decodeToken } from '../../utils/auth'

const AdminDashboard = ({ handleNetworkError }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [trigger, setTrigger] = useState(false)
    const [userCounts, setUserCounts] = useState({
        total: 0,
        active: 0,
        inactive: 0,
    })
    const usersPerPage = 5

    // Admin details
    const token = getToken()
    const adminUser = decodeToken(token)

    useEffect(() => {
        fetchUsers()
        fetchUserCounts()
    }, [handleNetworkError, trigger])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await AxiosUtility({
                url: 'https://resumeminingnodebe.azurewebsites.net/api/v1/users',
                method: 'GET',
                onNetworkError: handleNetworkError,
            })
            // console.log(response)
            const userData = response.map((user) => ({
                id: user._id,
                name: user.fullName,
                email: user.username,
                role: user.roles[0],
                status: user.Status.includes('ACTIVE'),
            }))
            setUsers(userData)
        } catch (error) {
            console.error('Failed to fetch users', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUserCounts = async () => {
        try {
            const response = await AxiosUtility({
                url: 'https://resumeminingnodebe.azurewebsites.net/api/v1/users/count',
                method: 'GET',
                onNetworkError: handleNetworkError,
            })
            setUserCounts(response)
        } catch (error) {
            console.error('Failed to fetch user counts', error)
        }
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
    }

    const handleRoleChange = async (index, newRole) => {
        try {
            const user = users[index]
            const response = await AxiosUtility({
                url: 'https://resumeminingnodebe.azurewebsites.net/api/v1/auth/roles',
                method: 'PATCH',
                data: {
                    username: user.email,
                    roles: [newRole],
                    Status: user.status ? ['ACTIVE'] : ['INACTIVE'],
                    usernameadmin: adminUser.username, // Replace with actual admin email
                },
                onNetworkError: handleNetworkError,
            })

            if (response) {
                const updatedUsers = [...users]
                updatedUsers[index].role = newRole
                setUsers(updatedUsers)
            }
        } catch (error) {
            console.error('Failed to update user role', error)
        }
    }

    const handleStatusChange = async (index) => {
        try {
            const user = users[index]
            const newStatus = !user.status
            const response = await AxiosUtility({
                url: 'https://resumeminingnodebe.azurewebsites.net/api/v1/auth/roles',
                method: 'PATCH',
                data: {
                    username: user.email,
                    roles: [user.role],
                    Status: newStatus ? ['ACTIVE'] : ['INACTIVE'],
                    usernameadmin: adminUser.username, // Replace with actual admin email
                },
                onNetworkError: handleNetworkError,
            })

            if (response) {
                const updatedUsers = [...users]
                updatedUsers[index].status = newStatus
                setUsers(updatedUsers)
            }
        } catch (error) {
            console.error('Failed to update user status', error)
        }
    }

    const handleDeleteUser = async (index) => {
        try {
            const user = users[index]
            // console.log(user, 'user')
            let id = user?.id
            const response = await AxiosUtility({
                url: `https://resumeminingnodebe.azurewebsites.net/api/v1/users/${id}`,
                method: 'DELETE',
                onNetworkError: handleNetworkError,
            })
            setTrigger(!trigger)
        } catch (error) {
            console.error('Failed to update user status', error)
        }
    }

    // const handleDeleteUser = (index) => {
    //     const updatedUsers = [...users]
    //     updatedUsers.splice(index, 1)
    //     setUsers(updatedUsers)
    // }

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

    const nPages = Math.ceil(filteredUsers.length / usersPerPage)

    return (
        <div className="flex h-screen overflow-hidden">
            <SidebarContainer />
            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderAdmin />
                <div className="flex-1 overflow-auto">
                    <div
                        className="relative min-h-screen flex flex-col items-center py-2 font-quicksand"
                        style={{
                            backgroundImage: `url(${globeBackground})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <main className="flex-1 p-8 w-full max-w-full overflow-x-auto">
                            <h1 className="text-2xl font-bold mb-6">
                                Admin Dashboard
                            </h1>

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <StatCard
                                    icon={faUsers}
                                    title="Total Users"
                                    total={userCounts.total.toString()}
                                    active={`Active Users ${userCounts.active}`}
                                    inactive={`Inactive Users ${userCounts.inactive}`}
                                />
                                <StatCard
                                    icon={faFileAlt}
                                    title="Total JD Listings"
                                    total="8"
                                    active="Active JDs 6"
                                    inactive="Inactive JDs 2"
                                />
                                <StatCard
                                    icon={faUserTie}
                                    title="Total Employees"
                                    total="16"
                                    active="Active Employees 13"
                                    inactive="Inactive Employees 3"
                                />
                            </div>

                            {/* User Management */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8 overflow-x-auto">
                                <h2 className="text-xl font-semibold mb-4">
                                    User Management
                                </h2>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Type to search"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="mb-4"
                                />
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-max">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2 px-4">
                                                    Name
                                                </th>
                                                <th className="text-left py-2 px-4">
                                                    Email
                                                </th>
                                                <th className="text-left py-2 px-4">
                                                    Role
                                                </th>
                                                <th className="text-left py-2 px-4">
                                                    Status
                                                </th>
                                                <th className="text-left py-2 px-4">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentUsers.map((user, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b"
                                                >
                                                    <td className="py-2 px-4">
                                                        {user.name}
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        {user.email}
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <Select
                                                            value={user.role}
                                                            onChange={(e) =>
                                                                handleRoleChange(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full"
                                                        >
                                                            <MenuItem value="ADMIN">
                                                                Admin
                                                            </MenuItem>
                                                            <MenuItem value="RECRUITER">
                                                                Recruiter
                                                            </MenuItem>
                                                            <MenuItem value="SUPERADMIN">
                                                                SuperAdmin
                                                            </MenuItem>
                                                            <MenuItem value="USER">
                                                                User
                                                            </MenuItem>
                                                            <MenuItem value="MANAGER">
                                                                Manager
                                                            </MenuItem>
                                                        </Select>
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <Switch
                                                            checked={
                                                                user.status
                                                            }
                                                            onChange={() =>
                                                                handleStatusChange(
                                                                    index
                                                                )
                                                            }
                                                            color="primary"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                color="red"
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    nPages={nPages}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    loading={loading}
                                />
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}

const StatCard = ({ icon, title, total, active, inactive }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center">
            <FontAwesomeIcon
                icon={icon}
                className="text-blue-500 text-2xl mr-4"
            />
            <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-3xl font-bold mb-2">{total}</p>
            </div>
        </div>
        <div className="text-right md:text-left">
            <p className="text-sm text-green-500">{active}</p>
            <p className="text-sm text-red-500">{inactive}</p>
        </div>
    </div>
)

export default AdminDashboard
