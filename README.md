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

First forked this project and clone it in to your machine

```bash
  git clone https://github.com/<github_username>/IT1140-P22
```

Go to the project directory

```bash
  cd IT1140-P22/webapp
```

Install dependencies

```bash
  npm install
```

Install dependencies

To run this project, you will need to add the following environment variables to your .env file

`VITE_SUPABASE_URL`
`VITE_SUPABASE_KEY`
`VITE_MISTRAL_API_KEY`

Start the server

```bash
  npm run dev
```
