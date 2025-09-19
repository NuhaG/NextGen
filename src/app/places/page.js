"use client";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

import React, { useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { PlacesPage } from "@/components/ui/PlacesPage";

export default function Page() {
  return <PlacesPage />;
}
