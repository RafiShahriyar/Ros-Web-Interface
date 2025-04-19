// src/components/VideoStream.jsx

import React from 'react';

const VideoStream = ({ url }) => {
  return (
    <div className="video-stream">
      <img src={url} alt="Live Video Feed" style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default VideoStream;
