import React from "react";
import { ArrowDownIcon, ArrowUpIcon, GroupIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";

interface CustomersCardProps {
  title?: string;
  value?: string;
  change?: string;
  isPositive?: boolean;
}

export const CustomersCard: React.FC<CustomersCardProps> = ({
  title = "Customers",
  value = "3,782",
  change = "11.01%",
  isPositive = true,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
        <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
            {value}
          </h4>
        </div>
        <Badge color={isPositive ? "success" : "error"}>
          {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
          {change}
        </Badge>
      </div>
    </div>
  );
};

export default CustomersCard;
