## BodySQL - Disrupting Healthcare, One Hot Dog at a Time 🌭

BodySQL is a healthcare monitoring and management system that built for Fundamental of Computing(IT1140) Mini Project Assignment.

![High Level Diagram](./docs/diagram-new.png)

## How It Works:

- Heart Rate Monitoring: A pulse sensor measures the heart rate and sends the data to an ESP32 microcontroller, which displays it on a 16x2 LCD and stores it in a Supabase database.

- Web Application: The web app fetches heart rate data from Supabase to display BPM rates and visualize them on a line chart. It also includes an AI chat feature for health-related queries and a medication routine management system.

- Medication Reminders: The system fetches medication data from Supabase. When it's time for medication, the ESP32 activates a buzzer and sends a WhatsApp message via Twilio.

- BPM Insights: Every 10 minutes, the system collects BPM data and sends AI insights to the user via WhatsApp using Twilio.

## How It Works:

#### Hardware Components

- ESP32 microcontroller
- Pulse sensor
- Piezo buzzer
- RTC
- 16x2 i2C LCD display
  -- i will update the arduino diagram soon.

#### Software Component

- Choreo Account - Sign up for a Choreo account to integrate and deploy services efficiently.
- Twilio Account - Create a Twilio Account for to to setup schedule task
- Supabase Database - We are using supabase as a database for this project, soo goo an set up it also

#### Install dependencies

You will need to install and configure the following dependencies on your machine to build this:

- Git
- Node.js v20.x (LTS)
- Arduino

## Run Locally

This repository is structured as follows:

IT1140-P22
├── docs # Documentation related to the project
│ ├── proposal  
│ ├── diagrams  
│ └── presentation  
├── hardware # All Arduino and hardware-related files
│ └── ino  
├── schedule-tasks # Task scheduling scripts and logic
│ ├── bpm-reminder # Scripts for BPM (heart rate) reminders
│ └── medication-reminder # Scripts for medication reminders
└── webapp # Web application code

First forked this project and clone it in to your machine

```bash
  git clone https://github.com/<github_username>/IT1140-P22
```

1. Web app setup

Go to the webapp directory

```bash
  cd IT1140-P22/webapp
```

Install dependencies

```bash
  npm install
```

To run this webapp, you will need to add the following environment variables to your public/config.js file

```JS
window.configs = {
  supabaseUrl: "Your Supabase URL",
  supabaseKey: "Your Supabase Anon key",
  mistralApiKey: "Mistral PAI",
};
```

first you need to create a supabase project, get the apikey,url and create these tables

```SQL
-- Table: health_conditions
CREATE TABLE health_conditions (
    id SERIAL PRIMARY KEY,        -- Unique ID for the health condition
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp of creation
    condition_name TEXT NOT NULL  -- Name of the health condition
);

-- Table: bpm_readings
CREATE TABLE bpm_readings (
    id SERIAL PRIMARY KEY,        -- Unique ID for the reading
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp of the reading
    bpm INT NOT NULL              -- Beats per minute value
);

-- Table: medications
CREATE TABLE medications (
    id SERIAL PRIMARY KEY,        -- Unique ID for the medication entry
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp of creation
    medication_name TEXT NOT NULL, -- Name of the medication
    dosage TEXT NOT NULL,         -- Dosage instructions
    frequency TEXT NOT NULL,      -- Frequency of the medication
    start_date DATE NOT NULL,     -- Start date for the medication
    end_date DATE,                -- End date for the medication (optional)
    condition_id INT REFERENCES health_conditions(id) ON DELETE SET NULL, -- Foreign key to health_conditions
    time TIME NOT NULL,           -- Time to take the medication
    condition_name TEXT           -- Name of the associated condition (redundant if using condition_id)
);

```

second things is you need to get a API Key from Mistral AI, go to the console.mistral.ai url and obtain a API key/

Start the server

```bash
  npm run dev
```

2. BPM Reminder

Go to the schedule-task/bpm-reminder directory

```bash
  cd schedule-task/bpm-reminder directory
```

Install dependencies

```bash
  npm install
```

create a `.env` file and add those values
`VITE_SUPABASE_URL`
`VITE_SUPABASE_KEY`
`VITE_MISTRAL_API_KEY`

3. Medication Reminder

do the same steps in 2. BPM Reminder
