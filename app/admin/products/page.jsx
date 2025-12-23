"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/services/apiProducts";
import { getCategories } from "@/services/apiCategories";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus, Search, X } from "lucide-react";
import Link from "next/link";
import AdminProductCard from "@/components/layout/AdminProductCard";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch products
  const {
    isLoading: isProductsLoading,
    data: products = [], // ✅ Default to empty array
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Fetch categories for filter
  const {
    data: categories = [], // ✅ Default to empty array
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  /* -------- Filtered Products -------- */
  const filteredProducts = useMemo(() => {
    // ✅ Safety check
    if (!products || !Array.isArray(products)) return [];

    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || product.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primarygreen-500">Products</h1>
        <span className="text-sm text-muted-foreground">
          {filteredProducts.length} items
        </span>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        {/* Search & Add Button Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primarygreen-500" />
            <Input
              placeholder="Search by name, color, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Add Product Button */}
          <Link href="/admin/products/add">
            <Button className="w-full sm:w-[180px] h-10 bg-primarygreen-500 text-primarygreen-50 hover:bg-primarygreen-700 transition-all duration-300">
              Add Product <CirclePlus />
            </Button>
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-primarygreen-500 text-primarygreen-50"
                : "bg-primarygreen-50 text-primarygreen-500 hover:bg-primarygreen-100"
            }`}
          >
            All ({products?.length || 0})
          </button>

          {categories.map((category) => {
            const count =
              products?.filter((p) => p.category_id === category.id).length ||
              0;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primarygreen-500 text-primarygreen-50"
                    : "bg-primarygreen-50 text-primarygreen-500 hover:bg-primarygreen-100"
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {isProductsLoading && (
        <p className="text-sm text-muted-foreground">Loading products...</p>
      )}

      {productsError && (
        <p className="text-sm text-red-500">Failed to load products</p>
      )}

      {!isProductsLoading && filteredProducts.length === 0 && (
        <p className="text-sm text-muted-foreground">No products found</p>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <AdminProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center sm:text-left">
          Showing {filteredProducts.length} of {products?.length || 0} products
        </div>
      )}
    </div>
  );
}
