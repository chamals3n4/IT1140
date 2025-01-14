// Hook for Fetching and Real-Time Updates
import { useState, useEffect } from "react";
import {
  fetchInitData,
  subscribeToRealtimeUpdates,
} from "@/supabase/fetchMedicationRoutings";
import supabase from "@/config/supabase";

export const useBpmData = () => {
  const [bpmData, setBpmData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchInitData();
      setBpmData(data);
    };

    fetchData();

    const subscription = subscribeToRealtimeUpdates((newData) => {
      console.log("New data received:", newData);
      setBpmData((prevData) => [newData, ...prevData]);
    });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return bpmData;
};
