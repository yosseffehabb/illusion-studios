// services/apiProducts.js
import supabase from "@/lib/supabase/client";

// Get all products
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, name, slug),
      variants:product_variants(id, size, stock)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
