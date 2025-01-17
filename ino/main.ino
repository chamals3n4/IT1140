#include <LiquidCrystal_I2C.h>
#include <PulseSensorPlayground.h>
#include <ESPSupabase.h>
#include <WiFi.h>
#include <ThreeWire.h>
#include <RtcDS1302.h>
#include <ArduinoJson.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const char *ssid = "Chamal's Galaxy M02s";
const char *password = "00000000";

const char *supabaseUrl = "";
const char *supabaseKey = "";
const char *tableName = "bpm_readings";
const char *medicationTableName = "medications";

Supabase supabase;

const int pulsePin = 36;
PulseSensorPlayground pulseSensor;
int bpm = 0;

// RTC
const int IO = 4;   // DAT
const int SCLK = 5; // CLK
const int CE = 2;   // RST
ThreeWire myWire(IO, SCLK, CE);
RtcDS1302<ThreeWire> Rtc(myWire);

// Buzzer
#define Buzzer 26

void setup()
{
    lcd.init();
    lcd.clear();
    lcd.backlight();

    Serial.begin(115200);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Connecting to Wi-Fi...");
    }
    Serial.println("Wi-Fi connected!");

    supabase.begin(supabaseUrl, supabaseKey);

    pulseSensor.analogInput(pulsePin);
    pulseSensor.setThreshold(550);

    if (!pulseSensor.begin())
    {
        Serial.println("Pulse Sensor initialization failed!");
        while (true)
            ;
    }

    Serial.println("Pulse Sensor started successfully!");

    // Initialize RTC
    Rtc.Begin();
    RtcDateTime compiled = RtcDateTime(__DATE__, __TIME__);
    if (!Rtc.IsDateTimeValid())
    {
        Serial.println("RTC lost confidence in the DateTime!");
        Rtc.SetDateTime(compiled);
    }
    if (Rtc.GetIsWriteProtected())
    {
        Serial.println("RTC was write protected, enabling writing now");
        Rtc.SetIsWriteProtected(false);
    }
    if (!Rtc.GetIsRunning())
    {
        Serial.println("RTC was not actively running, starting now");
        Rtc.SetIsRunning(true);
    }
    RtcDateTime now = Rtc.GetDateTime();
    if (now < compiled)
    {
        Serial.println("RTC is older than compile time!  (Updating DateTime)");
        Rtc.SetDateTime(compiled);
    }

    // Initialize Buzzer
    pinMode(Buzzer, OUTPUT);
}

void loop()
{
    bpm = pulseSensor.getBeatsPerMinute();

    if (pulseSensor.sawStartOfBeat())
    {
        Serial.print("Heartbeat detected! BPM: ");
        Serial.println(bpm);

        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("BPM: ");
        lcd.print(bpm);

        sendDataToSupabase(bpm);
    }

    // Fetch medication data from Supabase
    String medicationData = supabase.from(medicationTableName).select("*").doSelect();
    Serial.println(medicationData);

    // Parse the medication data
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, medicationData);
    if (error)
    {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.f_str());
        return;
    }

    // Get current time from RTC
    RtcDateTime now = Rtc.GetDateTime();
    char currentTime[6];
    snprintf(currentTime, sizeof(currentTime), "%02u:%02u", now.Hour(), now.Minute());

    // Check if current time matches any medication time
    for (JsonVariant medication : doc.as<JsonArray>())
    {
        String medicationTime = medication["time"];
        if (medicationTime.substring(0, 5) == currentTime)
        {
            digitalWrite(Buzzer, HIGH);
            delay(5000);
            digitalWrite(Buzzer, LOW);
            break;
        }
    }

    delay(5000);
}

void sendDataToSupabase(int bpm)
{
    String jsonData = "{\"bpm\": " + String(bpm) + "}";
    int response = supabase.insert("bpm_readings", jsonData, false);
    if (response == 200)
    {
        Serial.println("BPM data inserted successfully :)");
    }
    else
    {
        Serial.print("Failed to insert BPM data");
        Serial.println(response);
    }
}
