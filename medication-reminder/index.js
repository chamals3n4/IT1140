import dotenv from "dotenv";
import cron from "node-cron";
import twilio from "./config/twilio.js";
import supabase from "./config/supabase.js";

import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
dotenv.config();

const whatsappNum = process.env.TWILIO_WHATSAPP_NUM;

// Function to check medications and send alerts
const checkMedications = async () => {
  try {
    const { data: medications, error } = await supabase
      .from("medications")
      .select("*");

    if (error) throw error;

    const currentTime = new Date();
    const timeZone = "Asia/Colombo";
    const zonedCurrentTime = utcToZonedTime(currentTime, timeZone);
    const currentHours = zonedCurrentTime.getHours();
    const currentMinutes = zonedCurrentTime.getMinutes();

    console.log(`Current time: ${currentHours}:${currentMinutes}`);
    console.log(`Server time zone: ${timeZone}`);

    medications.forEach((medication) => {
      const [medHours, medMinutes] = medication.time.split(":").map(Number);

      console.log(
        `Checking medication: ${medication.medication_name} at ${medHours}:${medMinutes}`
      );

      if (medHours === currentHours && medMinutes === currentMinutes) {
        console.log(
          `It's time to take your ${medication.dosage} of ${medication.medication_name}.`
        );
        sendWhatsAppMessage(medication);
      }
    });
  } catch (error) {
    console.error("Error fetching medications:", error.message);
  }
};

// Real-time subscription to new medication inserts
const subscribeToMedications = async () => {
  const channel = supabase.channel("medications");

  channel
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "medications" },
      (payload) => {
        console.log("New medication added:", payload.new);
        checkMedications(); // Check all medications immediately after a new insert
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to real-time updates for medications.");
      }
    });
};

// run checkMedications every minute
cron.schedule("* * * * *", () => {
  console.log("Cron job triggered: Checking medications...");
  checkMedications();
});

async function sendWhatsAppMessage(medication) {
  try {
    const messageBody = `It's time to take your ${medication.dosage} of ${medication.medication_name}.`;
    const message = await twilio.messages.create({
      body: messageBody,
      from: `whatsapp:${whatsappNum}`,
      to: "whatsapp:+94717110160",
    });
    console.log(`Message sent: ${message.sid}`);
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
  }
}

console.log("Medication reminder service started...");
subscribeToMedications();
