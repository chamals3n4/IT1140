import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";
import { addDays } from "date-fns";
import Reminder from "../assets/images/Reminder.png";
import { MedicationRoutingDialog } from "../components/MedicationRoutingDialog";
import supabase from "@/config/supabase";
import { useToast } from "@/hooks/use-toast";
import DeleteMed from "@/components/DeleteMed";

import { Pill, Settings, Calendar, Clock, Timer, Trash2 } from "lucide-react";

export default function MediAlarm() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchMedications() {
      try {
        const { data, error } = await supabase.from("medications").select("*");

        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setMedications(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMedications();
  }, []);

  const handleDeleteClick = async (id) => {
    try {
      const { error } = await supabase
        .from("medications")
        .delete()
        .eq("id", id);
      if (error) {
        console.log("Error deleting medication:", error.message);
      } else {
        console.log("Medication Deleted Successfully");
        toast({
          variant: "success",
          title: "Medication Deleted Successfully",
          // description: "There was a problem with your request.",
        });
        setMedications((prev) =>
          prev.filter((medication) => medication.id !== id)
        );
      }
    } catch (error) {
      console.log("Error deleting medication:", error.message);
    }
  };

  return (
    <div className="flex-1 bg-pagebg space-y-4 p-8 pt-6">
      {/* Main Card */}
      <Card className="flex items-center bg-gray-900 rounded-medium shadow-none justify-between p-4">
        <div className="flex items-center space-x-4">
          <img
            src={Reminder}
            alt="reminder png "
            draggable="false"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h1 className="text-lg text-white font-bold">
              Stay on Track with Your Medications
            </h1>
            <p className="text-sm text-white text-muted-foreground">
              Maintain your health with our medication reminder. Set up your
              routines and get timely reminders to ensure you never miss a dose.
            </p>
          </div>
        </div>

        <MedicationRoutingDialog />
      </Card>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {medications.map((medication) => (
          <Card
            key={medication.id}
            className="w-full max-w-xs min-h-[140px] bg-white p-5 hover:border-bgsidebar transition duration-500"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                    <Pill className="h-6 w-6 text-violet-500" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-medium text-gray-900">
                      {medication.medication_name}
                    </h3>
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Pill className="h-3.5 w-3.5" />
                        {medication.dosage}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {medication.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5" />
                        {medication.frequency}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <Settings className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <DeleteMed
                handleDelete={() => handleDeleteClick(medication.id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
