import UserReview from "@/components/UserReview/UserReviews";
import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <>
      <section className="mt-8">
        <UserReview />
      </section>
    </>
  );
}
