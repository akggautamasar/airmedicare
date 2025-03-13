
import { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Share, Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

interface ShortsPlayerProps {
  videos: Video[];
  onVideoChange?: (videoId: string) => void;
}

export const ShortsPlayer = ({ videos, onVideoChange }: ShortsPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [startY, setStartY] = useState<number | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentVideo = videos[currentIndex];
  
  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startY === null) return;
    
    const endY = e.changedTouches[0].clientY;
    const diffY = startY - endY;
    
    // Swipe threshold
    if (Math.abs(diffY) > 50) {
      if (diffY > 0 && currentIndex < videos.length - 1) {
        // Swipe up - next video
        handleNextVideo();
      } else if (diffY < 0 && currentIndex > 0) {
        // Swipe down - previous video
        handlePreviousVideo();
      }
    }
    
    setStartY(null);
  };
  
  const handleNextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (onVideoChange) {
        onVideoChange(videos[currentIndex + 1].id);
      }
    }
  };
  
  const handlePreviousVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (onVideoChange) {
        onVideoChange(videos[currentIndex - 1].id);
      }
    }
  };
  
  const toggleLike = () => {
    if (!currentVideo) return;
    setIsLiked(prev => ({
      ...prev,
      [currentVideo.id]: !prev[currentVideo.id]
    }));
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    const iframe = document.getElementById('youtube-player') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      // Use YouTube Player API to mute/unmute
      isMuted
        ? iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*')
        : iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
    }
  };
  
  useEffect(() => {
    // Make player visible when videos load
    if (videos.length > 0) {
      setIsPlayerVisible(true);
    }
  }, [videos]);
  
  if (!currentVideo || videos.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white rounded-2xl">
        <p>No videos available</p>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-md relative">
      <div 
        ref={containerRef}
        className={cn(
          "relative h-[85vh] overflow-hidden bg-black rounded-2xl shadow-xl transition-all duration-500",
          isPlayerVisible ? "opacity-100" : "opacity-0"
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* YouTube Embed with touch overlay */}
        <div className="relative w-full h-full">
          <iframe
            id="youtube-player"
            className="absolute w-full h-full"
            src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&enablejsapi=1&mute=1&modestbranding=1&playsinline=1`}
            title={currentVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          
          {/* Swipe indicators */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6 text-white/70">
            {currentIndex < videos.length - 1 && (
              <div className="animate-bounce">
                <ChevronUp size={28} className="text-white/80" />
              </div>
            )}
            {currentIndex > 0 && (
              <div className="animate-bounce">
                <ChevronDown size={28} className="text-white/80" />
              </div>
            )}
          </div>
          
          {/* Video title and info */}
          <div className="absolute bottom-20 left-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
              {currentVideo.title}
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
                Health Tip
              </Badge>
              <span className="text-white/80 text-sm">#{currentIndex + 1}/{videos.length}</span>
            </div>
          </div>
          
          {/* Interactive buttons */}
          <div className="absolute right-4 bottom-28 flex flex-col items-center space-y-6">
            <button 
              onClick={toggleLike}
              className="p-3 rounded-full bg-black/50 backdrop-blur-sm transition-transform hover:scale-110"
            >
              <Heart 
                size={28} 
                className={cn(
                  "transition-colors", 
                  isLiked[currentVideo.id] 
                    ? "text-red-500 fill-red-500" 
                    : "text-white hover:text-red-400"
                )} 
              />
            </button>
            
            <button className="p-3 rounded-full bg-black/50 backdrop-blur-sm transition-transform hover:scale-110">
              <MessageCircle size={28} className="text-white hover:text-blue-400" />
            </button>
            
            <button className="p-3 rounded-full bg-black/50 backdrop-blur-sm transition-transform hover:scale-110">
              <Share size={28} className="text-white hover:text-green-400" />
            </button>
            
            <button 
              onClick={toggleMute} 
              className="p-3 rounded-full bg-black/50 backdrop-blur-sm transition-transform hover:scale-110"
            >
              {isMuted ? (
                <VolumeX size={28} className="text-white hover:text-yellow-400" />
              ) : (
                <Volume2 size={28} className="text-white hover:text-yellow-400" />
              )}
            </button>
          </div>
          
          {/* Transparent touch overlay for better interaction */}
          <div className="absolute inset-0 z-10"></div>
        </div>
      </div>
      
      {/* Video navigation controls */}
      <div className="flex justify-center mt-4 gap-2">
        <Button 
          variant="outline" 
          onClick={handlePreviousVideo} 
          disabled={currentIndex === 0}
          className="rounded-full bg-white/90 hover:bg-white"
        >
          <ChevronDown className="h-5 w-5 mr-1" /> Previous
        </Button>
        <Button 
          variant="outline" 
          onClick={handleNextVideo} 
          disabled={currentIndex === videos.length - 1}
          className="rounded-full bg-white/90 hover:bg-white"
        >
          Next <ChevronUp className="h-5 w-5 ml-1" />
        </Button>
      </div>
    </div>
  );
};
