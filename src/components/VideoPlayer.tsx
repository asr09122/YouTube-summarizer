import React from 'react';

interface VideoPlayerProps {
  videoId: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, className = '' }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full rounded-lg shadow-lg"
      />
    </div>
  );
};

export default VideoPlayer;