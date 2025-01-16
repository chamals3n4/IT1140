import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBpmData } from "@/hooks/useBpmData";
import { useState, useEffect } from "react";
import supabase from "@/config/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Database,
  MessageSquare,
  Cpu,
  Code,
  Palette,
  Cloud,
  Server,
  Layers,
} from "lucide-react";

import mistral from "../assets/images/icons/mistral.png";
import nodejs from "../assets/images/icons/nodejs.png";
import react from "../assets/images/icons/react.png";
import supabaseLogo from "../assets/images/icons/supabaselogo.png";
import shadcn from "../assets/images/icons/shadcn.png";
import vite from "../assets/images/icons/vite.png";
import choreo from "../assets/images/icons/choreo-by-wso2.png";
import twilio from "../assets/images/icons/twilio.png";
import tailwind from "../assets/images/icons/tailwind.png";

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

const techStack = [
  { name: "Supabase", icon: supabaseLogo },
  { name: "Twilio", icon: twilio },
  { name: "Arduino", icon: choreo },
  { name: "JavaScript", icon: mistral },
  { name: "React", icon: nodejs },
  { name: "Tailwind CSS", icon: shadcn },
  { name: "shadcn UI", icon: vite },
  { name: "WSO2", icon: react },
  { name: "Choreo", icon: tailwind },
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
          Disrupting Healthcare, One Hot Dog at a Time 🌭
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
          <p className="text-md">
            At BodySQL, we are using open-source tech to make healthcare as
            seamless as a hot dog-eating contest. We're not just building
            software; we're compressing the future into the present. BodySQL is
            also open-source, because we believe in making the world a better
            place, through innovation and collaboration
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-2 bg-card rounded-md hover:bg-accent transition-colors duration-200"
              >
                <img src={tech.icon} alt={tech.name} className="w-17 h-14" />
              </div>
            ))}
          </div>
        </CardContent>
        .
      </Card>
      <p className="text-md">
        The source code is available on{" "}
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          <span className="underline">GitHub</span>
        </a>
      </p>
    </div>
  );
}
