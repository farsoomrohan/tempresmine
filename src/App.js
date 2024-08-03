import './App.css'
import HomePage from './components/HomePage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ScanViewJobDescription from './pages/scan/ScanViewJD'
import ResumeContextProvider from './contextAPI'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import JobDescriptionMatchList from './pages/scan/JobDescriptionMatchList'
import LandingPage from './pages/LandingPage'
import ResumeSummaryPage from './components/ResumeSummaryPage'
import ResumeAnalysisReport from './components/ResumeAnalysisReport'
import NetworkError from './utils/network'
import { useState } from 'react'
import AdminDashboard from './admin/pages/AdminDashboard'
import BenchDataLists from './admin/pages/BenchDataLists'
import ProtectedRoute from './utils/ProtectedRoute'
import UploadBenchData from './admin/pages/UploadBench'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'

function App() {
    const [hasNetworkError, setHasNetworkError] = useState(false)

    const handleNetworkError = () => {
        setHasNetworkError(true)
    }

    if (hasNetworkError) {
        return <NetworkError />
    }

    return (
        <ResumeContextProvider>
            <Routes>
                <Route path="/" element={
                    <UnauthenticatedTemplate>
                        <LandingPage />
                    </UnauthenticatedTemplate>
                } />
                <Route
                    path="/home"
                    element={
                        <AuthenticatedTemplate>
                            <HomePage handleNetworkError={handleNetworkError} />
                        </AuthenticatedTemplate>
                    }
                />
                <Route
                    path="/upload/resumes/:jdId"
                    element={
                        <AuthenticatedTemplate>
                            <ScanViewJobDescription
                                handleNetworkError={handleNetworkError}
                            />
                        </AuthenticatedTemplate>
                    }
                />
                <Route
                    path="/matched/resumeslist/:jdId"
                    element={
                        <AuthenticatedTemplate>
                            <JobDescriptionMatchList
                                handleNetworkError={handleNetworkError}
                            />
                        </AuthenticatedTemplate>
                    }
                />
                <Route
                    path="/resumeSummary/:_id"
                    element={
                        <AuthenticatedTemplate>
                            <ResumeSummaryPage
                                handleNetworkError={handleNetworkError}
                            />
                        </AuthenticatedTemplate>
                    }
                />
                <Route
                    path="/resumeAnalysisReport/:_id"
                    element={
                        <AuthenticatedTemplate>
                            <ResumeAnalysisReport
                                handleNetworkError={handleNetworkError}
                            />
                        </AuthenticatedTemplate>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AuthenticatedTemplate>
                            <ProtectedRoute
                                element={
                                    <AdminDashboard
                                        handleNetworkError={handleNetworkError}
                                    />
                                }
                            />
                        </AuthenticatedTemplate>
                    }
                />

                <Route
                    path="/admin/upload-bench"
                    element={
                        <AuthenticatedTemplate>
                            <ProtectedRoute
                                element={
                                    <UploadBenchData
                                        handleNetworkError={handleNetworkError}
                                    />
                                }
                            />
                        </AuthenticatedTemplate>
                    }
                />
                <Route
                    path="/admin/bench-lists"
                    element={
                        <AuthenticatedTemplate>
                            <ProtectedRoute
                                element={
                                    <BenchDataLists
                                        handleNetworkError={handleNetworkError}
                                    />
                                }
                            />
                        </AuthenticatedTemplate>
                    }
                />
            </Routes>
            <ToastContainer />
        </ResumeContextProvider>
    )
}

export default App