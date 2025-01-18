import { useState, useEffect } from "react";
import {
  fetchInitPulseData,
  subscribeToRealtimeUpdatesPulse,
} from "@/supabase/fetch-pulse-data";
import supabase from "@/config/supabase";

export const useBpmData = () => {
  const [bpmData, setBpmData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchInitPulseData();
      setBpmData(data);
    };

    fetchData();

    const subscription = subscribeToRealtimeUpdatesPulse((newData) => {
      console.log("New data received:", newData);
      setBpmData((prevData) => [newData, ...prevData]);
    });

    return () => {
      // Unsubscribe on cleanup
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  return bpmData;
};
