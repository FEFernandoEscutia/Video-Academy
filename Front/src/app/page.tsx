import UserReview from "@/components/UserReview/UserReviews";
import Image from "next/image";
import React from "react";

export default function Home() {

  return (
    <>
    
    <button className="primary-btn">
      Explorar cursos
    </button>
    <button className="secondary-btn">
      Explorar cursos
    </button>
    <section className="mt-8">
      <UserReview/>
    </section>
    
    </>
    
  );
}
