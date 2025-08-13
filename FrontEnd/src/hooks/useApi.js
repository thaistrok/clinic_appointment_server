import { useState, useEffect } from 'react';

export const useApi = (apiCall, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  return { data, loading, error, setData };
};

/**
 * Custom hook for handling API mutations (POST, PUT, DELETE)
 */
export const useApiMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const execute = async (apiCall, payload) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await apiCall(payload);
      
      setSuccess(true);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, success, setError, setSuccess };
};