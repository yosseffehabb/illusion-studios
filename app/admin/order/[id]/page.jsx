"use client";

import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  const { id } = useParams();
  return <div> order . {id}</div>;
}
