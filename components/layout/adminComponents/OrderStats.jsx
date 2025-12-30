import React, { useMemo } from "react";
import { Clock, CheckCircle, Truck, Package, XCircle } from "lucide-react";

export default function OrderStats({ orders, onStatusClick }) {
  const statuses = [
    "pending",
    "confirmed",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  const statistics = useMemo(() => {
    return {
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      out_for_delivery: orders.filter((o) => o.status === "out_for_delivery")
        .length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  const getStatCardConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        bgColor: "bg-yellow-50",
        iconColor: "text-yellow-600",
        borderColor: "border-yellow-200",
      },
      confirmed: {
        icon: CheckCircle,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        borderColor: "border-blue-200",
      },
      out_for_delivery: {
        icon: Truck,
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
        borderColor: "border-purple-200",
      },
      delivered: {
        icon: Package,
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
        borderColor: "border-green-200",
      },
      cancelled: {
        icon: XCircle,
        bgColor: "bg-red-50",
        iconColor: "text-red-600",
        borderColor: "border-red-200",
      },
    };
    return (
      configs[status] || {
        icon: XCircle,
        bgColor: "bg-gray-50",
        iconColor: "text-gray-600",
        borderColor: "border-gray-200",
      }
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {statuses.map((status) => {
        const config = getStatCardConfig(status);
        const Icon = config.icon;
        const count = statistics[status] || 0;

        return (
          <div
            key={status}
            className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer`}
            onClick={() => onStatusClick(status)}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className={`h-5 w-5 ${config.iconColor}`} />
              <span className="text-2xl font-bold text-gray-900">{count}</span>
            </div>
            <div className="text-xs font-medium text-gray-600 capitalize">
              {status.replaceAll("_", " ")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
