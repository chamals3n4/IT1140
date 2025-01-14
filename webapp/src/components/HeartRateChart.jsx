import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const generateMockData = () => {
  const data = [];
  const hoursInDay = 24;
  const intervalsPerHour = 12; // 5-minute intervals

  for (let hour = 0; hour < hoursInDay; hour++) {
    for (let interval = 0; interval < intervalsPerHour; interval++) {
      const time = `${hour.toString().padStart(2, "0")}:${(interval * 5)
        .toString()
        .padStart(2, "0")}`;
      // random BPM between 60 and 100
      const bpm = Math.floor(70 + Math.random() * 30);
      data.push({ time, bpm });
    }
  }
  return data;
};

export function HeartRateChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Heart Rate Monitor</CardTitle>
        <CardDescription>24-hour heart rate data (BPM)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            bpm: {
              label: "Heart Rate (BPM)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[400px] w-[1100px]"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            style={{ padding: "0 20px" }}
          >
            <LineChart data={generateMockData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                interval={11}
                tickFormatter={(time) => time.split(":")[0] + "h"}
              />
              <YAxis
                domain={[40, 120]}
                tickFormatter={(value) => `${value} BPM`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="bpm"
                stroke="var(--color-bpm)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
