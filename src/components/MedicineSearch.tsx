import { useState } from "react";
import { Search, Pill, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Medicine {
  id: number;
  name: string;
  manufacturer: string;
  price: number;
  prescription_required: boolean;
  in_stock: boolean;
  description: string;
}

const mockMedicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    manufacturer: "GSK Healthcare",
    price: 29.99,
    prescription_required: false,
    in_stock: true,
    description: "Pain relief and fever reduction"
  },
  {
    id: 2,
    name: "Azithromycin 500mg",
    manufacturer: "Cipla Ltd",
    price: 149.99,
    prescription_required: true,
    in_stock: true,
    description: "Antibiotic for bacterial infections"
  },
  {
    id: 3,
    name: "Vitamin D3 60K",
    manufacturer: "Sun Pharma",
    price: 99.99,
    prescription_required: false,
    in_stock: true,
    description: "Weekly vitamin D supplement"
  }
];

export const MedicineSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const { toast } = useToast();

  const handleSearch = () => {
    const filtered = mockMedicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setMedicines(filtered);
  };

  const handleAddToCart = (medicine: Medicine) => {
    if (medicine.prescription_required) {
      toast({
        title: "Prescription Required",
        description: "Please upload a valid prescription to purchase this medicine.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart.`,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {medicines.map((medicine) => (
          <div
            key={medicine.id}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{medicine.name}</h3>
                <p className="text-gray-600">{medicine.manufacturer}</p>
                <p className="text-gray-500 text-sm mt-1">{medicine.description}</p>
                <div className="mt-2">
                  <span className="text-lg font-bold text-medical-primary">
                    ₹{medicine.price}
                  </span>
                  {medicine.prescription_required && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Prescription Required
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddToCart(medicine)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};