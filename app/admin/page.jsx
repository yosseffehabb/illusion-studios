"use client";

import FullScreenLoader from "@/components/layout/FullScreenLoader";
import ViewOrderButton from "@/components/layout/viewOrderButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllOrders } from "@/services/apiOrders";
import { Select } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import {
  Filter,
  Search,
  X,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
} from "lucide-react";
import React, { useState, useMemo } from "react";

export default function OrderTrackingPage() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Get orders from API data
  const orders = useMemo(() => data?.orders || [], [data]);

  const statuses = [
    "pending",
    "confirmed",
    "out for delivery",
    "delivered",
    "cancelled",
  ];

  // Calculate statistics
  const statistics = useMemo(() => {
    return {
      pending: orders.filter((order) => order.status === "pending").length,
      confirmed: orders.filter((order) => order.status === "confirmed").length,
      "out for delivery": orders.filter(
        (order) => order.status === "out for delivery"
      ).length,
      delivered: orders.filter((order) => order.status === "delivered").length,
      cancelled: orders.filter((order) => order.status === "cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  const hasActiveFilters = searchQuery !== "" || selectedStatus !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      "out for delivery": "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

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
      "out for delivery": {
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
    return configs[status];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <FullScreenLoader isLoading={isLoading} />;
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
        <div className="text-center py-12 text-red-600">
          Error loading orders: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl font-bold mb-6 text-primarygreen-500">
        Your Orders
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {statuses.map((status) => {
          const config = getStatCardConfig(status);
          const Icon = config.icon;
          const count = statistics[status];

          return (
            <div
              key={status}
              className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer`}
              onClick={() => setSelectedStatus(status)}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${config.iconColor}`} />
                <span className="text-2xl font-bold text-gray-900">
                  {count}
                </span>
              </div>
              <div className="text-xs font-medium text-gray-600 capitalize">
                {status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primarygreen-500" />
          <Input
            placeholder="Search by order number or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 h-10 w-full placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primarygreen-500 focus:border-primarygreen-500 focus-visible:ring-2 focus-visible:ring-primarygreen-500 focus-visible:ring-offset-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute  right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[180px] h-10 ">
            <Filter className="h-4 w-4 mr-2 text-primarygreen-500" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            className="w-full sm:w-auto h-9 bg-primarygreen-500 text-primarygreen-50 hover:bg-primarygreen-700 transition-all duration-300"
          >
            Clear
            <X className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Orders Table - Mobile Friendly */}
      <div className="border rounded-lg overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {orders.length === 0 ? "No orders yet" : "No orders found"}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block max-h-[calc(100vh-280px)] overflow-auto">
              <table className="w-full">
                <thead className="bg-primarygreen-500 sticky top-0 z-10 text-primarygreen-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Order Number
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium">
                        {order.order_number}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.customer_name}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        L.E {order.total_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-400">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <ViewOrderButton order={order} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden max-h-[calc(100vh-280px)] overflow-y-auto bg-primarygreen-50 p-4 space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 space-y-3 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm">
                        {order.order_number}
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {order.customer_name}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Total: </span>
                      <span className="font-semibold">
                        L.E {order.total_price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(order.created_at)}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 bg-primarygreen-500 text-primarygreen-50 hover:bg-primarygreen-700"
                  >
                    <Eye className="h-4 w-4 mr-2 " />
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Results Count */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center sm:text-left">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
}
