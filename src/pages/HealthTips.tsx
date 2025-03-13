
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

type HealthTip = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

const HealthTips = () => {
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthTips = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("health_tips")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setHealthTips(data || []);
      } catch (error) {
        console.error("Error fetching health tips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthTips();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quick Health Tips</h1>

        {loading ? (
          <div className="text-center py-10">Loading health tips...</div>
        ) : healthTips.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No health tips available at the moment. Check back later!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {healthTips.map((tip) => (
              <Card key={tip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {tip.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={tip.image_url}
                      alt={tip.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                )}
                <CardContent className={`p-6 ${!tip.image_url ? 'h-full' : ''}`}>
                  <h2 className="text-xl font-semibold mb-3">{tip.title}</h2>
                  <p className="text-gray-600">{tip.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTips;
