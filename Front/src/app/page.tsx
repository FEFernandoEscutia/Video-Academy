import Carousel from "@/components/Carrusel/Carousel";
import UserReview from "@/components/UserReview/UserReviews";
import React from "react";

export default function Home() {
  return (
    <>
    <section className="flex flex-col items-center justify-center h-[50vh] bg-gray-100 text-center">
      <h1 className="text-6xl font-bold">
        <span className="text-[]">Conso</span>
        <span className="text-[var(--primary)]">Learn</span>
      </h1>
      <p className="text-2xl text-gray-600 mb-8">
        Tu espacio para dominar el código y la innovación
      </p>
      <div className="flex space-x-4">
        <button className="px-6 py-2 border-2 rounded-2xl border-black text-black hover:bg-black hover:text-white transition-all">
          Explorar cursos
        </button>
        <button className="px-6 py-2 rounded-2xl bg-black text-white hover:bg-gray-800 transition-all">
          Acerca de
        </button>
      </div>
    </section>

    <section className="mt-8">
      <Carousel />
    </section>

      <section className="mt-8">
        <UserReview />
      </section>
    </>
  );
}
