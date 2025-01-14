import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBpmData } from "@/hooks/useBpmData";
import { useState, useEffect } from "react";
import supabase from "@/config/supabase";
import { Skeleton } from "@/components/ui/skeleton";

const activities = [
  {
    name: "Activity 1",
    description: "Description for activity 1",
    time: "2h ago",
  },
  {
    name: "Activity 2",
    description: "Description for activity 2",
    time: "2h ago",
  },
  {
    name: "Activity 3",
    description: "Description for activity 3",
    time: "2h ago",
  },
];

export default function Home() {
  const bpmData = useBpmData();

  const stats = [
    {
      name: "Latest Pulse Reading",
      value:
        bpmData.length > 0 ? (
          `${bpmData[0].bpm} BPM`
        ) : (
          <Skeleton className="h-6 w-[200px]" />
        ),
      change: "+20.1% from last month",
    },
    {
      name: "Next Dosage",
      value: "fef",
      change: "+20.1% from last month",
    },
    {
      name: "Health Status Summary",
      value: "Normal",
      change: "+20.1% from last month",
    },
    {
      name: "Data Uptime or Reliability",
      value: "+467",
      change: "+20.1% from last month",
    },
  ];

  return (
    <div className="flex-1 bg-pagebg space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif tracking-tight">
          Ahoy Chamal, welcome to BodySQL
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card className="border-bgsidebar" key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge
                className="mt-2"
                variant={stat.change.includes("-") ? "destructive" : "success"}
              >
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {activities.map((activity) => (
              <div
                key={activity.name}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
