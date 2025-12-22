import { useState } from "react";
import { ChevronLeft, ChevronRight, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";

export default function AdminProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Images are now directly in the images array
  const images = product.images || [];

  const priceAfterSale =
    product.price - (product.price * product.discount) / 100;

  // Calculate total stock from variants
  const totalStock =
    product.variants?.reduce((acc, variant) => acc + variant.stock, 0) || 0;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral border-border/50 flex flex-col justify-between">
      {/* Image Container */}
      <div className="relative overflow-hidden ">
        {images.length > 0 && (
          <Image
            className="object-cover"
            src={images[currentImageIndex]}
            alt={product.name}
            width={600}
            height={600}
          />
        )}

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
            <Badge
              variant="discount"
              className="text-[8px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-red-700 text-white"
            >
              -{product.discount}%
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
          <Badge
            variant="category"
            className="text-[8px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-black text-white border-0"
          >
            {product.category?.name || product.category}
          </Badge>
        </div>

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-0.5 sm:left-1 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-0.5 sm:p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-foreground" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-0.5 sm:p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-foreground" />
            </button>

            {/* Image Dots */}
            <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 sm:gap-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={cn(
                    "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all",
                    idx === currentImageIndex
                      ? "bg-primary w-2 sm:w-3"
                      : "bg-background/60 hover:bg-background/80"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
        {/* Product Name */}
        <h3 className="font-bold text-sm sm:text-sm text-foreground line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          <span className="text-sm sm:text-base font-bold text-primary">
            {priceAfterSale.toLocaleString()} L.E
          </span>
          {product.discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {product.price.toLocaleString()} L.E
            </span>
          )}
        </div>

        {/* Sizes & Stock */}
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Sizes {product.size_type && `(${product.size_type})`}
            </span>
            <span className="text-xs text-muted-foreground">
              Total{" "}
              <span className="font-medium text-foreground">{totalStock}</span>
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {product.variants?.map((variant) => {
              const available = variant.stock > 0;

              return (
                <div
                  key={variant.id}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-2 py-1",
                    "text-[10px] leading-tight",
                    available
                      ? "bg-muted text-foreground border-black"
                      : "bg-muted/50 text-red-700 opacity-70 border-red-700"
                  )}
                >
                  <span className="font-medium">{variant.size}</span>
                  <span className="opacity-60">({variant.stock})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SKU & Status */}
        <div className="flex items-center justify-between pt-1">
          {product.sku && (
            <span className="text-[10px] text-muted-foreground">
              SKU: {product.sku}
            </span>
          )}
          {product.status && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0",
                product.status === "active"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              )}
            >
              {product.status}
            </Badge>
          )}
        </div>
      </div>

      <Button className="w-full text-xs ">
        Customize <Cog />
      </Button>
    </div>
  );
}
