import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

export const YouTubeVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const playlistId = "PL7baHLYeLWk3uosvni7zdkGZ3f7gQG1V5";

  useEffect(() => {
    // For now, we'll use a few videos from the playlist as example
    // In a production app, you would fetch this from YouTube API
    const sampleVideos = [
      {
        id: "video1",
        title: "Health Tips for Better Living",
        thumbnail: "https://img.youtube.com/vi/VIDEO_ID_1/maxresdefault.jpg",
      },
      {
        id: "video2",
        title: "Medical Advice and Guidelines",
        thumbnail: "https://img.youtube.com/vi/VIDEO_ID_2/maxresdefault.jpg",
      },
      {
        id: "video3",
        title: "Understanding Common Health Issues",
        thumbnail: "https://img.youtube.com/vi/VIDEO_ID_3/maxresdefault.jpg",
      },
    ];
    setVideos(sampleVideos);
  }, []);

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Health & Medical Videos
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Watch our informative videos about health and medical topics
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleVideoClick(video.id)}
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href={`https://www.youtube.com/playlist?list=${playlistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-medical-primary hover:text-medical-dark font-medium"
          >
            View all videos on YouTube
          </a>
        </div>
      </div>
    </div>
  );
};