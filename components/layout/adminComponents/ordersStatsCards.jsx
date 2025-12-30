import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Truck,
  Clock,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const variantStyles = {
  total: {
    gradient: "bg-gradient-to-br from-purple-900 to-purple-950",
    iconBg: "bg-purple-800",
    iconColor: "text-purple-100",
    border: "border-purple-700",
  },
  success: {
    gradient: "bg-gradient-to-br from-green-900 to-green-950",
    iconBg: "bg-green-800",
    iconColor: "text-green-100",
    border: "border-green-700",
  },
  destructive: {
    gradient: "bg-gradient-to-br from-red-900 to-red-950",
    iconBg: "bg-red-800",
    iconColor: "text-red-100",
    border: "border-red-700",
  },
  pending: {
    gradient: "bg-gradient-to-br from-orange-900 to-orange-950",
    iconBg: "bg-orange-800",
    iconColor: "text-orange-100",
    border: "border-orange-700",
  },
  info: {
    gradient: "bg-gradient-to-br from-blue-900 to-blue-950",
    iconBg: "bg-blue-800",
    iconColor: "text-blue-100",
    border: "border-blue-700",
  },
};

function OrderStatsCard({
  title,
  count,
  icon: Icon,
  variant,
  delay = 0,
  trend,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const styles = variantStyles[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border backdrop-blur-sm p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${styles.gradient} ${styles.border}`}
      style={{
        animation: `slideUp 0.6s ease-out ${delay}ms both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold tracking-tight text-white">
              {count.toLocaleString()}
            </p>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  trend > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </div>
        <div
          className={`rounded-xl p-3 transition-all duration-300 ${
            styles.iconBg
          } ${isHovered ? "scale-110 rotate-12" : "scale-100 rotate-0"}`}
          style={{
            animation: isHovered ? "float 2s ease-in-out infinite" : "none",
          }}
        >
          <Icon className={`h-6 w-6 ${styles.iconColor}`} />
        </div>
      </div>

      <div
        className={`absolute -bottom-6 -right-6 h-32 w-32 rounded-full opacity-10 ${
          styles.iconBg
        } transition-all duration-500 ${
          isHovered ? "scale-150 opacity-20" : "scale-100"
        }`}
      />
      <div
        className={`absolute -top-4 -left-4 h-24 w-24 rounded-full opacity-10 ${
          styles.iconBg
        } transition-all duration-700 ${
          isHovered ? "scale-125 opacity-15" : "scale-100"
        }`}
      />

      <div
        className={`absolute bottom-0 left-0 h-1 ${
          styles.iconBg
        } transition-all duration-500 ${isHovered ? "w-full" : "w-0"}`}
      />
    </div>
  );
}

export default function OrderStatsSection({ orders, isLoading }) {
  const stats = {
    total: orders?.length ?? 0,
    pending: orders?.filter((o) => o.status === "pending").length ?? 0,
    confirmed: orders?.filter((o) => o.status === "confirmed").length ?? 0,
    delivered: orders?.filter((o) => o.status === "delivered").length ?? 0,
    cancelled: orders?.filter((o) => o.status === "cancelled").length ?? 0,
    outForDelivery:
      orders?.filter((o) => o.status === "out_for_delivery").length ?? 0,
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      <OrderStatsCard
        title="Total Orders"
        count={stats.total}
        icon={ShoppingCart}
        variant="total"
        delay={0}
        trend={12}
      />
      <OrderStatsCard
        title="Delivered"
        count={stats.delivered}
        icon={CheckCircle2}
        variant="success"
        delay={100}
        trend={8}
      />
      <OrderStatsCard
        title="Out for Delivery"
        count={stats.outForDelivery}
        icon={Truck}
        variant="info"
        delay={200}
      />
      <OrderStatsCard
        title="Pending"
        count={stats.pending}
        icon={Clock}
        variant="pending"
        delay={300}
        trend={-5}
      />
      <OrderStatsCard
        title="Cancelled"
        count={stats.cancelled}
        icon={XCircle}
        variant="destructive"
        delay={400}
        trend={-3}
      />
    </div>
  );
}
