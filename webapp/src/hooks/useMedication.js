// Hook for Fetching and Real-Time Medications
import { useState, useEffect } from "react";
import {
  fetchInitDataMedi,
  subscribeToRealtimeUpdatesMedi,
} from "@/supabase/fetch-medications";

import supabase from "@/config/supabase";

export const useMedication = () => {
  const [routineData, setRoutineData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchInitDataMedi();
      setRoutineData(data);
    };

    fetchData();

    const subscription = subscribeToRealtimeUpdatesMedi((newData) => {
      console.log("New data received:", newData);
      setRoutineData((prevData) => [newData, ...prevData]);
    });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return routineData;
};
