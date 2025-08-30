import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadMetadata } from '../utils/loadMetadata';

const MetadataContext = createContext();

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error('useMetadata must be used within MetadataProvider');
  }
  return context;
};

export const MetadataProvider = ({ children }) => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const data = await loadMetadata();
        setMetadata(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <MetadataContext.Provider value={{ metadata, loading, error }}>
      {children}
    </MetadataContext.Provider>
  );
};