// services/apiCategories.js
import supabase from "@/lib/supabase/client";

// Get all categories
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return data;
}

// Get all categories with product counts
export async function getCategoriesWithCounts() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);

  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const { count, error: countError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id);

      return {
        ...category,
        productCount: countError ? 0 : count || 0,
      };
    })
  );

  return categoriesWithCounts;
}

// Add category
export async function addCategory({ name, slug }) {
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Delete category (with safety check)
export async function deleteCategory(id) {
  // First, check if category has products
  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) throw new Error(countError.message);

  if (count > 0) {
    throw new Error(
      `Cannot delete category. ${count} product(s) are using it.`
    );
  }

  // Safe to delete
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
