import supabase from "@/config/supabase";

export const fetchInitPulseData = async () => {
  const { data, error } = await supabase
    .from("bpm_readings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  return data;
};

export const subscribeToRealtimeUpdatesPulse = (callback) => {
  const subscription = supabase
    .channel("bpm_readings")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "bpm_readings" },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
};
