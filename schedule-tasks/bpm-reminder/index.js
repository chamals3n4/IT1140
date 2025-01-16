import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";
import dotenv from "dotenv";
import { Mistral } from "@mistralai/mistralai";
dotenv.config();

// SUPABASE CONFIG
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// TWILIO CONFIG
const ACCSID = process.env.TWILIO_ACC_SID;
const AUTHTOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(ACCSID, AUTHTOKEN);

const apiKey = process.env.MISTRAL_API_KEY;
const mistral = new Mistral({ apiKey: apiKey });

const whatsappNum = process.env.TWILIO_WHATSAPP_NUM;

let bpmdata;

// Function to fetch BPM rates
const fetchBPMrates = async () => {
  try {
    const { data: bpm_readings, error } = await supabase
      .from("bpm_readings")
      .select("*")
      .order("id", { ascending: false })
      .limit(5);

    if (error) throw error;
    console.log(bpm_readings);
    bpmdata = bpm_readings;
  } catch (error) {
    console.error("Error fetching BPM data:", error.message);
  }
};

let chatResponse;
const mistralResponse = async () => {
  await fetchBPMrates();

  const response = await mistral.chat.complete({
    model: "mistral-large-latest",
    messages: [
      {
        role: "user",
        content: `According to this BPM data, you need to give some insights about each data in this JSON ${JSON.stringify(
          bpmdata
        )}. he ourput should be a frinedly message and should be less that 500 charactors,no need big explanation`,
      },
    ],
  });

  chatResponse = response.choices[0].message.content;
  console.log("Chat:", chatResponse);
};

async function sendTestWhatsAppMessage() {
  try {
    if (!chatResponse) {
      throw new Error("Chat response is empty");
    }
    const messageBody = chatResponse;
    const message = await client.messages.create({
      body: messageBody,
      from: `whatsapp:${whatsappNum}`,
      to: "whatsapp:+94717110160",
    });
    console.log(`Message sent: ${message.sid}`);
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
  }
}

// Ensure mistralResponse completes before sending the message
mistralResponse().then(() => {
  sendTestWhatsAppMessage();
});
