import React, { useEffect, useState } from "react";
import SidebarContainer from "../components/sidebarItem";
import HeaderAdmin from "../components/header";
import { Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

const UploadBenchData = ({ handleNetworkError }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    console.log('Uploading:', selectedFile);
  };

  return (
    <>
      <div className="flex h-screen">
        <SidebarContainer />
        <div className="flex flex-col flex-1">
          <HeaderAdmin />
          <div className="w-full flex flex-col items-center min-h-screen py-8">
          <div className="w-4/5 max-w-4xl">
            <div className="flex justify-between mb-4">
              <h1 className="text-2x1 text-textHeading font-bold">Upload Bench</h1>
              <h1 className="text-2x1 text-textHeading font-bold">List of Bench Employees</h1>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="subtitle1">Bulk Upload</Typography>
                {/* <Typography 
                  variant="body2" 
                  color="primary" 
                  component="a" 
                  href="#" 
                  sx={{ textDecoration: 'none' }}
                >
                  Download template
                </Typography> */}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                <CloudUploadIcon sx={{ fontSize: '3rem', color: '#3B82F6' }} />
                <Typography variant="body1" className="mt-2">
                  Drag & drop files or
                </Typography>
                <label htmlFor="file-input">
                  <Button
                    variant="text"
                    component="span"
                    sx={{ color: '#3B82F6', textTransform: 'none', mt: 0.5 }}
                  >
                    Browse
                  </Button>
                </label>
                <Typography variant="body2" color="textSecondary" className="mt-1">
                  Files Supported: PDF.
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mt-1">
                  Maximum Size: 1 MB
                </Typography>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-input"
                />
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    color: '#6B7280',
                    borderColor: '#E5E7EB',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  sx={{ backgroundColor: '#1E40AF', color: 'white' }}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default UploadBenchData;
