import React from 'react';
import '../styles/LoadingSpinner.scss'

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <h3>Please wait</h3>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;