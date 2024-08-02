import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobCardViewList from './JobCardViewList';
import { BrowserRouter } from 'react-router-dom';
import * as AxiosUtility from '../utils/AxiosUtility';

jest.mock('../utils/AxiosUtility');

describe('JobCardViewList', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <JobCardViewList handleNetworkError={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText('Job Listings')).toBeInTheDocument();
  });

  it('fetches and displays job listings', async () => {
    const mockData = {
      jobDetails: {
        items: [
          { _id: '1', clientName: 'Test Client', jobTitle: 'Test Job', updatedAt: new Date().toISOString() },
        ],
        totalItems: 1,
        totalPages: 1,
      },
    };
    
    AxiosUtility.default.mockResolvedValue(mockData);
    
    render(
      <BrowserRouter>
        <JobCardViewList handleNetworkError={() => {}} />
      </BrowserRouter>
    );
    
    await waitFor(() => expect(screen.getByText('Test Client')).toBeInTheDocument());
    expect(screen.getByText('Test Job')).toBeInTheDocument();
  });

  it('filters job listings when searching', async () => {
    const mockData = {
      jobDetails: {
        items: [
          { _id: '1', clientName: 'Test Client', jobTitle: 'Test Job', updatedAt: new Date().toISOString() },
          { _id: '2', clientName: 'Another Client', jobTitle: 'Another Job', updatedAt: new Date().toISOString() },
        ],
        totalItems: 2,
        totalPages: 1,
      },
    };
    
    AxiosUtility.default.mockResolvedValue(mockData);
    
    render(
      <BrowserRouter>
        <JobCardViewList handleNetworkError={() => {}} />
      </BrowserRouter>
    );
    
    await waitFor(() => expect(screen.getByText('Test Client')).toBeInTheDocument());
    expect(screen.getByText('Another Client')).toBeInTheDocument();
    
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    
    await waitFor(() => expect(screen.getByText('Test Client')).toBeInTheDocument());
    expect(screen.queryByText('Another Client')).not.toBeInTheDocument();
  });

  it('calls handleNetworkError when there is a network error', async () => {
    const handleNetworkError = jest.fn();
    AxiosUtility.default.mockRejectedValue(new Error('Network Error'));
    
    render(
      <BrowserRouter>
        <JobCardViewList handleNetworkError={handleNetworkError} />
      </BrowserRouter>
    );
    
    await waitFor(() => expect(handleNetworkError).toHaveBeenCalled());
  });

  it('handles pagination correctly', async () => {
    const mockData = {
      jobDetails: {
        items: [
          { _id: '1', clientName: 'Page 1 Client', jobTitle: 'Page 1 Job', updatedAt: new Date().toISOString() },
        ],
        totalItems: 2,
        totalPages: 2,
      },
    };
    
    AxiosUtility.default.mockResolvedValue(mockData);
    
    render(
      <BrowserRouter>
        <JobCardViewList handleNetworkError={() => {}} />
      </BrowserRouter>
    );
    
    await waitFor(() => expect(screen.getByText('Page 1 Client')).toBeInTheDocument());
    
    const nextPageButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextPageButton);
    
    const updatedMockData = {
      jobDetails: {
        items: [
          { _id: '2', clientName: 'Page 2 Client', jobTitle: 'Page 2 Job', updatedAt: new Date().toISOString() },
        ],
        totalItems: 2,
        totalPages: 2,
      },
    };
    
    AxiosUtility.default.mockResolvedValue(updatedMockData);
    
    await waitFor(() => expect(screen.getByText('Page 2 Client')).toBeInTheDocument());
    expect(screen.queryByText('Page 1 Client')).not.toBeInTheDocument();
  });
});