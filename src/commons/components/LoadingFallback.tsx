import { LoadingOverlay } from '@mantine/core';
import React from 'react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="relative min-h-[200px]">
      <LoadingOverlay visible={true} overlayBlur={1000} />
    </div>
  );
};

export default LoadingFallback;
