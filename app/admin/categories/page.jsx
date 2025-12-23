"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getCategories,
  addCategory,
  deleteCategory,
  getCategoriesWithCounts,
} from "@/services/apiCategories";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Search, X, Trash2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const queryClient = useQueryClient();

  // Fetch categories with product counts
  const {
    isLoading: isCatLoading,
    data: categories = [],
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesWithCounts,
  });

  // Add category mutation
  const { mutate: addCatMutation, isPending: isAdding } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      reset();
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error("Error adding category:", error);
      alert(error.message);
    },
  });

  // Delete category mutation
  const { mutate: deleteCatMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteError(null);
    },
    onError: (error) => {
      setDeleteError(error.message);
      setTimeout(() => setDeleteError(null), 5000); // Clear after 5s
    },
  });

  const { register, reset, handleSubmit } = useForm();

  function onSubmit(data) {
    addCatMutation(data);
  }

  function handleDelete(category) {
    if (category.productCount > 0) {
      setDeleteError(
        `Cannot delete "${category.name}". It has ${category.productCount} product(s) using it. Please reassign or delete those products first.`
      );
      return;
    }

    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      deleteCatMutation(category.id);
    }
  }

  /* -------- Filtered Categories -------- */
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [categories, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primarygreen-500">Categories</h1>
        <span className="text-sm text-muted-foreground">
          {filteredCategories.length} items
        </span>
      </div>

      {/* Delete Error Alert */}
      {deleteError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Cannot Delete Category</p>
            <p className="text-sm">{deleteError}</p>
          </div>
          <button
            onClick={() => setDeleteError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primarygreen-500" />
          <Input
            placeholder="Search by name or slug..."
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

        {/* Add Category Button */}
        <Button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-[180px] h-10 bg-primarygreen-500 text-primarygreen-50 hover:bg-primarygreen-700 transition-all duration-300"
        >
          Add Category <CirclePlus />
        </Button>
      </div>

      {/* Add Category Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-primarygreen-500">
              Add New Category
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label className="text-primarygreen-500" htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Category name"
                  required
                  {...register("name")}
                  className="mt-1 bg-primarygreen-50 placeholder:text-neutral-400"
                />
              </div>
              <div>
                <Label className="text-primarygreen-500" htmlFor="slug">
                  Slug
                </Label>
                <Input
                  id="slug"
                  type="text"
                  placeholder="category-slug"
                  required
                  {...register("slug")}
                  className="mt-1 bg-primarygreen-50 placeholder:text-neutral-400"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  className="bg-primarygreen-50 text-primarygreen-500 shadow-md border"
                  onClick={() => {
                    reset();
                    setIsFormOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isAdding}
                  className="bg-primarygreen-500 text-primarygreen-50 hover:bg-primarygreen-700"
                >
                  {isAdding ? "Adding..." : "Add Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {isCatLoading && (
        <p className="text-sm text-muted-foreground">Loading categories...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">Failed to load categories</p>
      )}

      {!isCatLoading && !filteredCategories.length && (
        <p className="text-sm text-muted-foreground">No categories found</p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="relative rounded-xl border border-neutral-400 p-4 hover:shadow-md transition bg-primarygreen-50"
          >
            {/* Delete Button */}
            <button
              onClick={() => handleDelete(category)}
              disabled={category.productCount > 0 || isDeleting}
              className={`absolute top-2 right-2 p-1.5 rounded transition-colors ${
                category.productCount > 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-red-500 hover:bg-red-50"
              }`}
              title={
                category.productCount > 0
                  ? `Cannot delete - ${category.productCount} product(s) using it`
                  : "Delete category"
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Category Info */}
            <h3 className="font-semibold text-primarygreen-500 pr-8">
              {category.name}
            </h3>
            <p className="text-xs text-neutral-400">/{category.slug}</p>

            {/* Product Count */}
            <p className="text-xs text-neutral-500 mt-2">
              {category.productCount || 0} product(s)
            </p>
          </div>
        ))}
      </div>

      {filteredCategories.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center sm:text-left">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      )}
    </div>
  );
}
