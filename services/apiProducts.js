import supabase from "../lib/supabase/client";

export async function getProducts() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
            *,
            category:categories(id, name, slug),
            variants:product_variants(id, size, stock)
          `
      )
      .eq("status", "active") // Only active products
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      products: products || [],
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      products: [],
      error: error.message,
    };
  }
}
