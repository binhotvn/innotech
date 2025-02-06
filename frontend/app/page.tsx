import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>This is a simple shop</h1>
      <Link href="/shop">
        <Button>Go to shop</Button>
      </Link>
    </div>
  );
};

export default HeroSection;
