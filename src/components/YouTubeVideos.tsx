
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
import { ShortsPlayer } from "./ShortsPlayer";
import { Button } from "./ui/button";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

export const YouTubeVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"carousel" | "shorts">("shorts");
  const playlistId = "PL7baHLYeLWk3uosvni7zdkGZ3f7gQG1V5";
  const API_KEY = "AIzaSyBrjwtI5UVNwlboA5l9twUA42iqs21DI6U";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${playlistId}&key=${API_KEY}`
        );
        const data = await response.json();
        
        const formattedVideos = data.items.map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url || item.snippet.thumbnails.default.url,
        }));
        
        setVideos(formattedVideos);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        // Fallback to sample data if API fails
        const sampleVideos = [
          {
            id: "dQw4w9WgXcQ", // Example video ID
            title: "Health Tips for Better Living",
            thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          },
          {
            id: "QH2-TGUlwu4", // Another example video ID
            title: "Medical Advice and Guidelines",
            thumbnail: "https://img.youtube.com/vi/QH2-TGUlwu4/maxresdefault.jpg",
          },
          {
            id: "9bZkp7q19f0", // Another example video ID
            title: "Understanding Common Health Issues",
            thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
          },
        ];
        setVideos(sampleVideos);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Quick Health Tips
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Watch our short, informative videos about health and medical topics
          </p>
          
          {/* View mode toggle */}
          <div className="flex justify-center mt-6 space-x-4">
            <Button 
              variant={viewMode === "carousel" ? "default" : "outline"}
              onClick={() => setViewMode("carousel")}
              className="rounded-full"
            >
              Gallery View
            </Button>
            <Button 
              variant={viewMode === "shorts" ? "default" : "outline"}
              onClick={() => setViewMode("shorts")}
              className="rounded-full"
            >
              Shorts View
            </Button>
          </div>
        </div>
        
        {viewMode === "shorts" ? (
          <ShortsPlayer videos={videos} />
        ) : (
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
        )}

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
