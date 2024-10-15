"use client";
import React, { useState, useEffect } from 'react';
import CarouselImage from '@/interfaces/Carousel';
import Link from 'next/link';

const images: CarouselImage[] = [
    { src: 'https://contactomaestro.colombiaaprende.edu.co/sites/default/files/maestrospublic/styles/interna_850x260/public/2022-11/nuevos-cursos-ap-articulo.png?h=827069f2&itok=TaJ5t3i5',
        alt: 'Producto 1', href: '/producto/1' },
    { src: 'https://www.serimcol.com.co/wp-content/uploads/2020/08/Webinar.png',
        alt: 'Producto 2', href: '/producto/2' },
    { src: 'https://www.lucushost.com/blog/wp-content/uploads/2020/04/plugin-cursos-online-wordpress.png',
        alt: 'Producto 3', href: '/producto/3' },
    // Agrega más imágenes y enlaces según sea necesario
];


const Carousel: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        }, 3000); // Cambia la imagen cada 3 segundos

        return () => clearInterval(interval);
    }, []);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="carousel-container relative w-full h-64 overflow-hidden mt-2">
        <button onClick={prevImage} className="absolute left-0 top-1/2 -translate-y-1/2">
            &#9664;
        </button>

        {images.map((image, index) => (
            <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            
            >
            <Link href={image.href}>
                <p>
                <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full object-cover"
                />
                </p>
            </Link>
            </div>
        ))}

        <button onClick={nextImage} className="absolute right-0 top-1/2 -translate-y-1/2">
            &#9654;
        </button>
        </div>
    );
};

export default Carousel;
