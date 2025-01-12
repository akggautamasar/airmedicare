import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      {
        id: "video4",
        title: "Daily Health Routines",
        thumbnail: "https://img.youtube.com/vi/VIDEO_ID_4/maxresdefault.jpg",
      },
      {
        id: "video5",
        title: "Wellness Tips & Tricks",
        thumbnail: "https://img.youtube.com/vi/VIDEO_ID_5/maxresdefault.jpg",
      },
    ];
    setVideos(sampleVideos);
  }, []);

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Quick Health Tips
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Watch our short, informative videos about health and medical topics
          </p>
        </div>
        
        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {videos.map((video) => (
                <CarouselItem key={video.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => handleVideoClick(video.id)}
                  >
                    <div className="relative aspect-[9/16]">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <h3 className="text-white font-semibold text-lg line-clamp-2">
                          {video.title}
                        </h3>
                      </div>
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <div className="text-center mt-8">
          <a
            href={`https://www.youtube.com/playlist?list=${playlistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-medical-primary hover:text-medical-dark font-medium transition-colors"
          >
            View all videos on YouTube
          </a>
        </div>
      </div>
    </div>
  );
};