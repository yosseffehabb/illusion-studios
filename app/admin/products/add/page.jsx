"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Upload } from "lucide-react";

// Mock categories with UUIDs (would come from API in production)
const MOCK_CATEGORIES = [
  { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Shirts" },
  { id: "b2c3d4e5-f6g7-8901-bcde-f12345678901", name: "Pants" },
  { id: "c3d4e5f6-g7h8-9012-cdef-123456789012", name: "Shoes" },
  { id: "d4e5f6g7-h8i9-0123-defg-234567890123", name: "Accessories" },
  { id: "e5f6g7h8-i9j0-1234-efgh-345678901234", name: "Outerwear" },
];

// Auto-generated sizes based on type
const DEFAULT_SIZES = {
  numeric: ["30", "32", "34"],
  letter: ["S", "M", "L"],
};

export default function AddProductPage() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    color: "",
    category_id: "",
    size_type: "",
    discount: "0",
    status: "active",
  });

  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Handle basic input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Handle size type change - auto-generate variants
  const handleSizeTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, size_type: value }));
    setTouched((prev) => ({ ...prev, size_type: true }));

    // Auto-generate default variants
    const defaultSizes = DEFAULT_SIZES[value] || [];
    setVariants(defaultSizes.map((size) => ({ size, stock: 0 })));

    if (errors.size_type || errors.variants) {
      setErrors((prev) => ({ ...prev, size_type: null, variants: null }));
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result,
            file: file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    setTouched((prev) => ({ ...prev, images: true }));
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }));
    }

    // Reset input
    e.target.value = "";
  };

  // Remove image
  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Add new variant
  const addVariant = () => {
    setVariants((prev) => [...prev, { size: "", stock: 0 }]);
  };

  // Update variant
  const updateVariant = (index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    if (errors.variants) {
      setErrors((prev) => ({ ...prev, variants: null }));
    }
  };

  // Remove variant
  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation logic
  const validate = () => {
    const newErrors = {};

    // Basic Information
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!formData.color.trim()) newErrors.color = "Color is required";

    // Classification
    if (!formData.category_id) newErrors.category_id = "Category is required";
    const discount = parseFloat(formData.discount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    // Images
    if (images.length === 0)
      newErrors.images = "At least one image is required";

    // Variants
    if (!formData.size_type) newErrors.size_type = "Size type is required";
    if (variants.length === 0) {
      newErrors.variants = "At least one size variant is required";
    } else {
      // Check each variant
      const hasInvalidVariant = variants.some((v) => {
        return !v.size.trim() || isNaN(v.stock) || v.stock < 0;
      });
      if (hasInvalidVariant) {
        newErrors.variants =
          "All variants must have a size and valid stock (≥ 0)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid for submit button
  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.description.trim() &&
      formData.price &&
      parseFloat(formData.price) > 0 &&
      formData.color.trim() &&
      formData.category_id &&
      formData.size_type &&
      images.length > 0 &&
      variants.length > 0 &&
      variants.every((v) => v.size.trim() && v.stock >= 0)
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    // Mark all fields as touched
    setTouched({
      name: true,
      description: true,
      price: true,
      color: true,
      category_id: true,
      size_type: true,
      images: true,
      variants: true,
    });

    if (!validate()) {
      return;
    }

    // Build final product object
    const product = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      color: formData.color.trim(),
      category_id: formData.category_id,
      size_type: formData.size_type,
      discount: parseFloat(formData.discount) || 0,
      status: formData.status,
      images: images.map((img) => img.url),
      variants: variants.map((v) => ({
        size: v.size.trim(),
        stock: parseInt(v.stock),
      })),
    };

    console.log("Product submitted:", product);
    alert("Product data logged to console! Check the browser console (F12).");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the product details below. All fields marked with * are
            required.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <Separator className="mb-6" />

            <div className="space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Classic Cotton T-Shirt"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={
                    touched.name && errors.name ? "border-red-500" : ""
                  }
                />
                {touched.name && errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description *
                </label>
                <Textarea
                  placeholder="Describe the product features, materials, and benefits..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className={
                    touched.description && errors.description
                      ? "border-red-500"
                      : ""
                  }
                />
                {touched.description && errors.description && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price (EGP) *
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={
                      touched.price && errors.price ? "border-red-500" : ""
                    }
                  />
                  {touched.price && errors.price && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Color *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Navy Blue"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className={
                      touched.color && errors.color ? "border-red-500" : ""
                    }
                  />
                  {touched.color && errors.color && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.color}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Classification */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Classification
            </h2>
            <Separator className="mb-6" />

            <div className="space-y-5">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category *
                </label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    handleInputChange("category_id", value)
                  }
                >
                  <SelectTrigger
                    className={
                      touched.category_id && errors.category_id
                        ? "border-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.category_id && errors.category_id && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.category_id}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Active products are visible to customers
                  </p>
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Discount (%)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) =>
                      handleInputChange("discount", e.target.value)
                    }
                    className={
                      touched.discount && errors.discount
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {touched.discount && errors.discount && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.discount}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-500">
                    Optional discount (0-100%)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Images Upload */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Product Images
            </h2>
            <Separator className="mb-6" />

            <div className="space-y-4">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images *
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("image-upload").click()
                    }
                    className="w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                  <span className="text-sm text-gray-500">
                    {images.length} {images.length === 1 ? "image" : "images"}{" "}
                    selected
                  </span>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Upload one or more product images. At least 1 image is
                  required.
                </p>
                {touched.images && errors.images && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.images}</p>
                )}
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                        <img
                          src={img.url}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Section 4: Size & Stock Variants */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Size & Stock Variants
            </h2>
            <Separator className="mb-6" />

            <div className="space-y-5">
              {/* Size Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Size Type *
                </label>
                <Select
                  value={formData.size_type}
                  onValueChange={handleSizeTypeChange}
                >
                  <SelectTrigger
                    className={
                      touched.size_type && errors.size_type
                        ? "border-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select size type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numeric">
                      Numeric (e.g., 30, 32, 34)
                    </SelectItem>
                    <SelectItem value="letter">
                      Letter (e.g., S, M, L)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {touched.size_type && errors.size_type && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.size_type}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-gray-500">
                  Default sizes will be auto-generated based on your selection
                </p>
              </div>

              {/* Variants List */}
              {formData.size_type && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Sizes *
                  </label>

                  {variants.map((variant, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <Input
                            type="text"
                            placeholder="Size"
                            value={variant.size}
                            onChange={(e) =>
                              updateVariant(index, "size", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Stock"
                            min="0"
                            value={variant.stock}
                            onChange={(e) =>
                              updateVariant(index, "stock", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeVariant(index)}
                        disabled={variants.length === 1}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {errors.variants && (
                    <p className="text-sm text-red-600">{errors.variants}</p>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVariant}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Size
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="min-w-[150px]"
            >
              Create Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
