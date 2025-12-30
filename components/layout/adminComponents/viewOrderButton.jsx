import React from "react";
import { Button } from "../../ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function ViewOrderButton({ order }) {
  return (
    <Link href={`/admin/order/${order.id}`}>
      <Button className="h-8 bg-primarygreen-500 text-primarygreen-50 hover:bg-primarygreen-700">
        <Eye />
      </Button>
    </Link>
  );
}
