import { HeartRateChart } from "@/components/HeartRateChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Analytics() {
  return (
    <div className="flex-1 bg-pagebg space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-md font-serif tracking-tight">
          Pulse Rate Analytics
        </h2>
      </div>
      <HeartRateChart />
    </div>
  );
}
