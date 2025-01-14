import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Trash2Icon,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

export default function MedicationEntry({
  medication,
  index,
  isExpanded,
  onToggle,
  onRemove,
  onChange,
  errors,
}) {
  if (!isExpanded) {
    return (
      <Card className="relative">
        <CardContent className="p-4 pr-12">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">
                {medication.name || "Unnamed Medication"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {medication.frequency
                  ? `Every ${medication.frequency.replace("hours", " hours")}`
                  : "Frequency not set"}
              </p>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onToggle(index)}
              >
                <ChevronDownIcon className="h-4 w-4" />
                <span className="sr-only">Expand medication details</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onRemove(index)}
              >
                <Trash2Icon className="h-4 w-4" />
                <span className="sr-only">Remove medication</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium leading-none pt-2">
            Medication Details
          </h4>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onToggle(index)}
            >
              <ChevronUpIcon className="h-4 w-4" />
              <span className="sr-only">Collapse medication details</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onRemove(index)}
            >
              <Trash2Icon className="h-4 w-4" />
              <span className="sr-only">Remove medication</span>
            </Button>
          </div>
        </div>
        <div>
          <Label
            htmlFor={`medication-name-${index}`}
            className="block text-sm font-medium text-gray-700"
          >
            Medication Name
          </Label>
          <Input
            id={`medication-name-${index}`}
            placeholder="e.g., Paracetamol"
            value={medication.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            className={
              errors[`medications.${index}.name`] ? "border-red-500" : ""
            }
          />
          {errors[`medications.${index}.name`] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[`medications.${index}.name`]}
            </p>
          )}
        </div>
        <div>
          <Label
            htmlFor={`medication-dosage-${index}`}
            className="block text-sm font-medium text-gray-700"
          >
            Dosage
          </Label>
          <Input
            id={`medication-dosage-${index}`}
            placeholder="e.g., 500mg"
            value={medication.dosage}
            onChange={(e) => onChange(index, "dosage", e.target.value)}
            className={
              errors[`medications.${index}.dosage`] ? "border-red-500" : ""
            }
          />
          <Label className="block text-sm font-medium text-gray-700">
            Time
          </Label>
          <Input
            type="time"
            placeholder="Set Time"
            value={medication.time}
            onChange={(e) => onChange(index, "time", e.target.value)}
          />
          {errors[`medications.${index}.dosage`] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[`medications.${index}.dosage`]}
            </p>
          )}
        </div>
        <div>
          <Label
            htmlFor={`medication-frequency-${index}`}
            className="block text-sm font-medium text-gray-700"
          >
            Frequency
          </Label>
          <Select
            value={medication.frequency}
            onValueChange={(value) => onChange(index, "frequency", value)}
          >
            <SelectTrigger
              id={`medication-frequency-${index}`}
              className={
                errors[`medications.${index}.frequency`] ? "border-red-500" : ""
              }
            >
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4hours">Every 4 hours</SelectItem>
              <SelectItem value="6hours">Every 6 hours</SelectItem>
              <SelectItem value="8hours">Every 8 hours</SelectItem>
              <SelectItem value="12hours">Every 12 hours</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
          {errors[`medications.${index}.frequency`] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[`medications.${index}.frequency`]}
            </p>
          )}
        </div>
        {/* <div>
          <Label
            htmlFor={`medication-timeOfDay-${index}`}
            className="block text-sm font-medium text-gray-700"
          >
            Time of Day
          </Label>
          <Select
            value={medication.timeOfDay}
            onValueChange={(value) => onChange(index, "timeOfDay", value)}
          >
            <SelectTrigger
              id={`medication-timeOfDay-${index}`}
              className={
                errors[`medications.${index}.timeOfDay`] ? "border-red-500" : ""
              }
            >
              <SelectValue placeholder="Select time of day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
          {errors[`medications.${index}.timeOfDay`] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[`medications.${index}.timeOfDay`]}
            </p>
          )}
        </div> */}
        <div>
          <Label
            htmlFor={`medication-endDate-${index}`}
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full pl-3 text-left font-normal ${
                  !medication.endDate && "text-muted-foreground"
                } ${
                  errors[`medications.${index}.endDate`] ? "border-red-500" : ""
                }`}
              >
                {medication.endDate ? (
                  format(medication.endDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={medication.endDate}
                onSelect={(date) => onChange(index, "endDate", date)}
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors[`medications.${index}.endDate`] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[`medications.${index}.endDate`]}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor={`medication-startDate-${index}`}
            className="block text-sm font-medium text-gray-700"
          >
            Satrt Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full pl-3 text-left font-normal ${
                  !medication.startDate && "text-muted-foreground"
                } ${
                  errors[`medications.${index}.startDate`]
                    ? "border-red-500"
                    : ""
                }`}
              >
                {medication.startDate ? (
                  format(medication.startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={medication.startDate}
                onSelect={(date) => onChange(index, "startDate", date)}
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors[`medications.${index}.startDate`] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[`medications.${index}.startDate`]}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
