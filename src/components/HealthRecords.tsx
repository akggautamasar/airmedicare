import { useState } from "react";
import { FileText, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface HealthRecord {
  id: number;
  type: string;
  date: string;
  title: string;
  fileSize: string;
}

const mockRecords: HealthRecord[] = [
  {
    id: 1,
    type: "Lab Report",
    date: "2024-02-15",
    title: "Blood Test Report",
    fileSize: "2.4 MB"
  },
  {
    id: 2,
    type: "Prescription",
    date: "2024-02-10",
    title: "General Consultation",
    fileSize: "1.1 MB"
  },
  {
    id: 3,
    type: "Vaccination",
    date: "2024-01-20",
    title: "COVID-19 Certificate",
    fileSize: "0.8 MB"
  }
];

export const HealthRecords = () => {
  const [records] = useState<HealthRecord[]>(mockRecords);
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Upload Health Record",
      description: "This feature will be available soon.",
    });
  };

  const handleDownload = (record: HealthRecord) => {
    toast({
      title: "Downloading Record",
      description: `Downloading ${record.title}...`,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Health Records</h2>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Upload New Record
        </Button>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{record.title}</h3>
                  <p className="text-sm text-gray-500">{record.type}</p>
                  <p className="text-xs text-gray-400">
                    Uploaded on {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDownload(record)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};