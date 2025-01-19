import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBpmData } from "@/hooks/useBpmData";
import { useMedication } from "@/hooks/useMedication";
import {
  Activity,
  Bell,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  PillIcon as Pills,
  Stethoscope,
  Timer,
  User,
  CheckCircle,
  AlertCircle,
  Droplet,
  Zap,
} from "lucide-react";

export default function Home() {
  const bpmData = useBpmData();
  const routineData = useMedication();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyStats, setDailyStats] = useState({
    medicationsTaken: 0,
    medicationsRemaining: 0,
    readingsInRange: 0,
    totalReadings: 0,
  });
  const [waterIntake, setWaterIntake] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (routineData.length > 0) {
      const taken = routineData.filter((med) => {
        const medTime = new Date(`${currentTime.toDateString()} ${med.time}`);
        return medTime < currentTime;
      }).length;

      setDailyStats((prev) => ({
        ...prev,
        medicationsTaken: taken,
        medicationsRemaining: routineData.length - taken,
      }));
    }
  }, [routineData, currentTime]);

  useEffect(() => {
    if (bpmData.length > 0) {
      const inRange = bpmData.filter(
        (reading) => reading.bpm >= 60 && reading.bpm <= 100
      ).length;
      setDailyStats((prev) => ({
        ...prev,
        readingsInRange: inRange,
        totalReadings: bpmData.length,
      }));
    }
  }, [bpmData]);

  const getBpmStatus = (bpm) => {
    if (bpm < 60) return { status: "Low", color: "text-blue-500" };
    if (bpm > 100) return { status: "High", color: "text-red-500" };
    return { status: "Normal", color: "text-green-500" };
  };

  const getNextDosageTime = () => {
    if (!routineData.length) return null;
    const nextDosage = new Date(
      `${currentTime.toDateString()} ${routineData[0].time}`
    );
    const diff = nextDosage.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };

  const nextDosage = getNextDosageTime();
  const bpmStatus = bpmData.length > 0 ? getBpmStatus(bpmData[0].bpm) : null;

  const handleWaterIntake = () => {
    setWaterIntake((prev) => Math.min(prev + 250, 2000)); // Increment by 250ml, max 2000ml
  };

  const resetWaterIntake = () => {
    setWaterIntake(0);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif tracking-tight">
            Making the world better place with Healthcare 🩺
          </h2>
          <p className="text-muted-foreground">
            Your comprehensive health dashboard and medication tracker
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2 border-bgsidebar">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Pulse Reading
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {bpmData.length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {bpmData[0].bpm}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    BPM
                  </span>
                </div>
                <div className={`mt-2 text-sm ${bpmStatus?.color}`}>
                  {bpmStatus?.status} Heart Rate
                </div>
                <Progress
                  value={(bpmData[0].bpm / 200) * 100}
                  className="mt-3"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  Last updated:{" "}
                  {new Date(bpmData[0].timestamp).toLocaleString()}
                </div>
              </>
            ) : (
              <Skeleton className="h-6 w-[200px]" />
            )}
          </CardContent>
        </Card>

        <Card className="border-bgsidebar">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Next Medication
            </CardTitle>
            <Pills className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {routineData.length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {routineData[0].medication_name}
                </div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {routineData[0].time}
                  {nextDosage && (
                    <Badge variant="secondary" className="ml-2">
                      in {nextDosage.hours}h {nextDosage.minutes}m
                    </Badge>
                  )}
                </div>
              </>
            ) : (
              <Skeleton className="h-6 w-[200px]" />
            )}
          </CardContent>
        </Card>

        <Card className="border-bgsidebar">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Daily Overview</div>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Readings in Range:
                </span>
                <Badge variant="secondary">
                  {dailyStats.readingsInRange}/{dailyStats.totalReadings}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Medications Taken:
                </span>
                <Badge variant="secondary">
                  {dailyStats.medicationsTaken}/{routineData.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Schedule
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentTime.toLocaleTimeString()}
            </div>
            <ScrollArea className="h-[100px] mt-2">
              {routineData.map((med, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm py-1"
                >
                  <span className="text-muted-foreground">
                    {med.medication_name}
                  </span>
                  <span>{med.time}</span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medication Progress
            </CardTitle>
            <Pills className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="text-2xl font-bold">
                  {Math.round(
                    (dailyStats.medicationsTaken / routineData.length) * 100
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Daily Progress</p>
              </div>
              <Progress
                value={(dailyStats.medicationsTaken / routineData.length) * 100}
                className="w-[60px] rotate-90"
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {dailyStats.medicationsRemaining} medications remaining today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Heart Rate Status
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="text-2xl font-bold">
                  {Math.round(
                    (dailyStats.readingsInRange / dailyStats.totalReadings) *
                      100
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Readings in Range
                </p>
              </div>
              {bpmStatus?.status === "Normal" ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              )}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {dailyStats.readingsInRange} out of {dailyStats.totalReadings}{" "}
              readings within normal range
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{waterIntake} ml</p>
                <p className="text-xs text-muted-foreground">
                  Daily Goal: 2000 ml
                </p>
              </div>
              <Progress
                value={(waterIntake / 2000) * 100}
                className="w-[60px] rotate-90"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <Button onClick={handleWaterIntake} size="sm">
                Add 250ml
              </Button>
              <Button onClick={resetWaterIntake} variant="outline" size="sm">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        View the source code on{" "}
        <a
          href="https://github.com/chamals3n4/IT1140-P22"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
