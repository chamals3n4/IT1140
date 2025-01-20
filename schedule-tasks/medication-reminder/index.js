import dotenv from "dotenv";
import cron from "node-cron";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

dotenv.config();

// SUPABASE CONFIG
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// TWILIO CONFIG
const ACCSID = process.env.TWILIO_ACC_SID;
const AUTHTOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(ACCSID, AUTHTOKEN);

const whatsappNum = process.env.TWILIO_WHATSAPP_NUM;

const checkMedications = async () => {
  try {
    const { data: medications, error } = await supabase
      .from("medications")
      .select("*");

    if (error) {
      console.error("Error fetching medications from Supabase:", error.message);
      return;
    }

    // const currentTime = new Date();
    // const timeZone = "Asia/Colombo";
    // const zonedCurrentTime = utcToZonedTime(currentTime, timeZone); // Adjust for time zone
    // const currentHours = zonedCurrentTime.getHours();
    // const currentMinutes = zonedCurrentTime.getMinutes();

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    console.log(
      `Current time: ${currentHours}:${currentMinutes} (Date: ${now})`
    );

    // Check if any medication is due
    medications.forEach((medication) => {
      const [medHours, medMinutes] = medication.time.split(":").map(Number);

      console.log(
        `Checking medication: ${medication.medication_name} at ${medHours}:${medMinutes}`
      );

      if (medHours === currentHours && medMinutes === currentMinutes) {
        console.log(
          `Time to take ${medication.dosage} of ${medication.medication_name}.`
        );
        sendWhatsAppMessage(medication);
      }
    });
  } catch (error) {
    console.error("Error in checkMedications:", error.message);
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
        checkMedications(); // Check all medications after a new insert
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to real-time updates for medications.");
      } else {
        console.error("Error subscribing to medications:", status);
      }
    });
};

// Send a WhatsApp message
async function sendWhatsAppMessage(medication) {
  try {
    const messageBody = `It's time to take your ${medication.dosage} of ${medication.medication_name}.`;
    const message = await client.messages.create({
      body: messageBody,
      from: `whatsapp:${whatsappNum}`,
      to: "whatsapp:+94717110160",
    });
    console.log(`Message sent successfully: ${message.sid}`);
  } catch (error) {
    console.error(`Error sending WhatsApp message: ${error.message}`);
  }
}

async function sendTestWhatsAppMessage() {
  try {
    const messageBody = `to aluth crush eka - i lost my self in loving you 🥺`;
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

<<<<<<< HEAD
//cron job to run checkMedications every minute
=======
//  cron job to run checkMedications every minute
>>>>>>> f61cb0473f2cbf8704bd80d2f33df4ae5b39e059
cron.schedule("* * * * *", () => {
  console.log("Cron job triggered: Checking medications...");
  checkMedications();
});

checkMedications();

// Start the service
console.log("Medication reminder service started...");
subscribeToMedications();
//sendTestWhatsAppMessage();
