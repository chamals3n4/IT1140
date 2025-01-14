#include <LiquidCrystal_I2C.h>
#include <PulseSensorPlayground.h>
#include <ESPSupabase.h>
#include <WiFi.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const char *ssid = "4G booster 941 ib 1";
const char *password = "R5A17DR10Q4";

const char *supabaseUrl = "https://wth.supabase.co";
const char *supabaseKey = "eyJhbGci......-GkOTQ_hDpzGwE";
const char *tableName = "bpm_readings";

Supabase supabase;

const int pulsePin = 36;
PulseSensorPlayground pulseSensor;
int bpm = 0;

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
