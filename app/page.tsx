import DashboardLayout from "@/layout/DashboardLayout";
import CustomersCard from "@/components/dashboard/CustomersCard";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of your store metrics
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:max-w-xl">
          <CustomersCard
            title="Customers"
            value="3,782"
            change="11.01%"
            isPositive={true}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
