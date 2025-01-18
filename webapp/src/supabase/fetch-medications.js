import supabase from "@/config/supabase";

export const fetchInitDataMedi = async () => {
  let { data, error } = await supabase
    .from("medications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  return data;
};

export const subscribeToRealtimeUpdatesMedi = (callback) => {
  return supabase
    .channel("medications")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "bpm_readings" },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
};
