import { Navbar } from "@/components/Navbar";

const HealthTips = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quick Health Tips</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Stay Hydrated</h2>
            <p className="text-gray-600">Drink at least 8 glasses of water daily to maintain good health and energy levels.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Regular Exercise</h2>
            <p className="text-gray-600">Aim for at least 30 minutes of moderate physical activity every day.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Balanced Diet</h2>
            <p className="text-gray-600">Include fruits, vegetables, whole grains, and lean proteins in your daily meals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTips;