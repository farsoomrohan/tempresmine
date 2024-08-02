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
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/home"
                    element={
                        <HomePage handleNetworkError={handleNetworkError} />
                    }
                />
                <Route
                    path="/upload/resumes/:jdId"
                    element={
                        <ScanViewJobDescription
                            handleNetworkError={handleNetworkError}
                        />
                    }
                />
                <Route
                    path="/matched/resumeslist/:jdId"
                    element={
                        <JobDescriptionMatchList
                            handleNetworkError={handleNetworkError}
                        />
                    }
                />
                <Route
                    path="/resumeSummary/:_id"
                    element={
                        <ResumeSummaryPage
                            handleNetworkError={handleNetworkError}
                        />
                    }
                />
                <Route
                    path="/resumeAnalysisReport/:_id"
                    element={
                        <ResumeAnalysisReport
                            handleNetworkError={handleNetworkError}
                        />
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            element={
                                <AdminDashboard
                                    handleNetworkError={handleNetworkError}
                                />
                            }
                        />
                    }
                />

                <Route
                    path="/admin/upload-bench"
                    element={
                        <ProtectedRoute
                            element={
                                <UploadBenchData
                                    handleNetworkError={handleNetworkError}
                                />
                            }
                        />
                    }
                />
                <Route
                    path="/admin/bench-lists"
                    element={
                        <ProtectedRoute
                            element={
                                <BenchDataLists
                                    handleNetworkError={handleNetworkError}
                                />
                            }
                        />
                    }
                />
            </Routes>
            <ToastContainer />
        </ResumeContextProvider>
    )
}

export default App