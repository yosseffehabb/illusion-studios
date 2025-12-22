import supabase from "../lib/supabase/client";
// ============================================
// GET ALL ORDERS (Admin)
// ============================================
export async function getAllOrders() {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_color,
          product_sku,
          size,
          quantity,
          unit_price,
          discount,
          subtotal
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      orders: orders,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      orders: [],
      error: error.message,
    };
  }
}

// ============================================
// GET ORDERS BY STATUS
// ============================================
export async function getOrdersByStatus(status) {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_color,
          product_sku,
          size,
          quantity,
          unit_price,
          discount,
          subtotal
        )
      `
      )
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      orders: orders,
    };
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return {
      success: false,
      orders: [],
      error: error.message,
    };
  }
}

// ============================================
// GET SINGLE ORDER BY ID
// ============================================
export async function getOrderById(orderId) {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_color,
          product_sku,
          size,
          quantity,
          unit_price,
          discount,
          subtotal
        )
      `
      )
      .eq("id", orderId)
      .single();

    if (error) throw error;

    return {
      success: true,
      order: order,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      order: null,
      error: error.message,
    };
  }
}

// ============================================
// GET ORDER BY ORDER NUMBER
// ============================================
export async function getOrderByNumber(orderNumber) {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_color,
          product_sku,
          size,
          quantity,
          unit_price,
          discount,
          subtotal
        )
      `
      )
      .eq("order_number", orderNumber)
      .single();

    if (error) throw error;

    return {
      success: true,
      order: order,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      order: null,
      error: error.message,
    };
  }
}

// ============================================
// SEARCH ORDERS BY PHONE NUMBER
// ============================================
export async function getOrdersByPhone(phone) {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_color,
          product_sku,
          size,
          quantity,
          unit_price,
          discount,
          subtotal
        )
      `
      )
      .eq("customer_phone", phone)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      orders: orders,
    };
  } catch (error) {
    console.error("Error fetching orders by phone:", error);
    return {
      success: false,
      orders: [],
      error: error.message,
    };
  }
}

// ============================================
// UPDATE ORDER STATUS
// ============================================
export async function updateOrderStatus(orderId, newStatus) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      order: data,
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// GET ORDER STATISTICS
// ============================================
export async function getOrderStats() {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("status, total_price");

    if (error) throw error;

    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      out_for_delivery: orders.filter((o) => o.status === "out_for_delivery")
        .length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      totalRevenue: orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + Number(o.total_price), 0),
    };

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return {
      success: false,
      stats: null,
      error: error.message,
    };
  }
}

// ============================================
// SEARCH ORDERS (by customer name or order number)
// ============================================
export async function searchOrders(query) {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_color,
          product_sku,
          size,
          quantity,
          unit_price,
          discount,
          subtotal
        )
      `
      )
      .or(
        `customer_name.ilike.%${query}%,order_number.ilike.%${query}%,customer_phone.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      orders: orders,
    };
  } catch (error) {
    console.error("Error searching orders:", error);
    return {
      success: false,
      orders: [],
      error: error.message,
    };
  }
}

// ============================================
// GET RECENT ORDERS (Last N orders)
// ============================================
export async function getRecentOrders(limit = 10) {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_color,
          product_sku,
          size,
          quantity,
          unit_price,
          discount,
          subtotal
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      success: true,
      orders: orders,
    };
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return {
      success: false,
      orders: [],
      error: error.message,
    };
  }
}
