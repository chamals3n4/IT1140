import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MedicationEntry from "./MedicationEntry";
import supabase from "@/config/supabase";

export function MedicationRoutingDialog() {
  const [open, setOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [formData, setFormData] = useState({
    condition: "",
    medications: [
      {
        name: "",
        dosage: "",
        time: "",
        frequency: "",
        // timeOfDay: "",
        endDate: null,
        startDate: null,
      },
    ],
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, condition: e.target.value });
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...formData.medications];
    newMedications[index] = { ...newMedications[index], [field]: value };
    setFormData({ ...formData, medications: newMedications });
  };

  const handleAddMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { name: "", dosage: "", frequency: "", timeOfDay: "", endDate: null },
      ],
    });
    setExpandedIndex(formData.medications.length);
  };

  const handleRemoveMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: newMedications });
    if (expandedIndex === index) {
      setExpandedIndex(Math.max(0, index - 1));
    }
  };

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.condition.length < 2) {
      newErrors.condition = "Condition must be at least 2 characters.";
    }
    formData.medications.forEach((med, index) => {
      if (med.name.length < 2) {
        newErrors[`medications.${index}.name`] =
          "Medication name must be at least 2 characters.";
      }
      if (!med.dosage) {
        newErrors[`medications.${index}.dosage`] = "Dosage is required.";
      }
      if (!med.time) {
        newErrors[`medications.${index}.time`] = "Time is required.";
      }
      if (!med.frequency) {
        newErrors[`medications.${index}.frequency`] = "Frequency is required.";
      }
      // if (!med.timeOfDay) {
      //   newErrors[`medications.${index}.timeOfDay`] =
      //     "Time of day is required.";
      // }
      if (!med.endDate) {
        newErrors[`medications.${index}.endDate`] = "End date is required.";
      }

      if (!med.startDate) {
        newErrors[`medications.${index}.startDate`] = "Start date is required.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     try {
  //       // Step 1: Insert the condition
  //       const { data: conditionData, error: conditionError } = await supabase
  //         .from("health_conditions")
  //         .insert([{ condition_name: formData.condition }])
  //         .single();

  //       if (conditionError) throw conditionError;
  //       const conditionId = conditionData.id;
  //       // Step 2: Insert medications
  //       const medicationInserts = formData.medications.map((medication) => ({
  //         medication_name: medication.name,
  //         dosage: medication.dosage,
  //         time: medication.time,
  //         frequency: medication.frequency,
  //         // time_of_date: medication.timeOfDay,
  //         start_date: medication.startDate,
  //         end_date: medication.endDate,
  //         condition_id: conditionId,
  //       }));

  //       const { data, error } = await supabase
  //         .from("medications")
  //         .insert(medicationInserts);

  //       if (error) {
  //         throw error;
  //       }

  //       console.log("Data inserted successfully:", data);
  //       setOpen(false);
  //     } catch (error) {
  //       console.error("Error inserting data:", error);
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Step 1: Insert the condition
        const { data: conditionData, error: conditionError } = await supabase
          .from("health_conditions")
          .insert([{ condition_name: formData.condition }])
          .select("id") // Retrieve the condition_id
          .single();

        console.log("Condition Insert Result:", {
          conditionData,
          conditionError,
        });

        if (conditionError) throw conditionError;
        if (!conditionData) throw new Error("Failed to retrieve condition_id");

        const conditionId = conditionData.id;

        // Step 2: Insert medications
        const medicationInserts = formData.medications.map((medication) => ({
          medication_name: medication.name,
          dosage: medication.dosage,
          time: medication.time,
          frequency: medication.frequency,
          start_date: medication.startDate,
          end_date: medication.endDate,
          condition_id: conditionId,
        }));

        const { data, error } = await supabase
          .from("medications")
          .insert(medicationInserts);

        if (error) throw error;

        console.log("Data inserted successfully:", data);
        setOpen(false);
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-bgsidebar hover:bg-bgsidebar">
          Add Medication Routing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto  scroll-smooth">
        <DialogHeader>
          <DialogTitle>Add Medication Routing</DialogTitle>
          <DialogDescription>
            Enter the details for the condition and its medications. Click save
            when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="condition"
              className="block text-sm font-medium text-gray-700"
            >
              Condition
            </label>
            <Input
              id="condition"
              placeholder="e.g., Fever"
              value={formData.condition}
              onChange={handleInputChange}
              className={errors.condition ? "border-red-500" : ""}
            />
            {errors.condition && (
              <p className="mt-1 text-sm text-red-500">{errors.condition}</p>
            )}
          </div>
          <div className="space-y-4">
            {formData.medications.map((medication, index) => (
              <MedicationEntry
                key={index}
                medication={medication}
                index={index}
                isExpanded={expandedIndex === index}
                onToggle={handleToggle}
                onRemove={handleRemoveMedication}
                onChange={handleMedicationChange}
                errors={errors}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleAddMedication}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Another Medication
            </Button>
          </div>
          <DialogFooter>
            <Button type="submit">Save Routing</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
