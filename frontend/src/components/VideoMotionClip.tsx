import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { getStorageUrl } from '../services/supabaseStorage';

interface VideoMotionClipProps {
  className?: string;
}

export const VideoMotionClip: React.FC<VideoMotionClipProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`tp-clip ${className}`}>
      <video
        ref={videoRef}
        aria-label="Video of a tiny apricot teddy bear puppy in the TeddyPups showroom"
        loop
        muted
        playsInline
        poster={getStorageUrl('/media/puppy_showroom_poster.jpg')}
        src={getStorageUrl('/media/puppy_showroom_720p.mp4')}
        onClick={togglePlay}
        style={{ cursor: 'pointer' }}
      />
      <button
        type="button"
        className="tp-clip__play"
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        aria-pressed={isPlaying ? 'true' : 'false'}
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause size={18} color="var(--color-cocoa)" />
        ) : (
          <Play size={20} color="var(--color-cocoa)" style={{ marginLeft: '2px' }} />
        )}
      </button>
    </div>
  );
};
