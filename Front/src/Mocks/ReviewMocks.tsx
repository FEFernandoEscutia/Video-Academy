const reseñasMock = [
    {
        id: "d1f1c8a0-45e7-4c4b-bcf7-a6e43c3e3f63",
        content: "¡Increíble video, las explicaciones fueron muy claras!",
        videoId: "b2f1e4c8-7d6c-4e8e-b3f7-d65c4d07a1a2",
        userId: "a1b2c3d4-5e6f-7890-1234-56789abcdef0",
        user: {
            id: "a1b2c3d4-5e6f-7890-1234-56789abcdef0",
            email: "juan.perez@example.com",
            password: "hashedpassword123",
            name: "Juan Pérez",
            image: "https://example.com/juan.jpg",
            role: "USER",
            videos: [], // Si se necesita agregar videos comprados.
            orders: [], // Si se necesita agregar órdenes.
            reviews: [], // Puede referenciar a esta reseña u otras que el usuario haya hecho.
            subscription: null // O puede contener detalles de su suscripción.
        }
    },
    {
        id: "e2d1c6a1-56b8-4f9e-9b5a-b2e4f3d6a8e4",
        content: "Buen contenido, pero podría haber incluido más ejemplos.",
        videoId: "c2e4f7b3-8c4d-4e9e-b5a6-d57e6b8f9c2a",
        userId: "a2b3c4d5-6f7e-8901-2345-67890abcdef1",
        user: {
            id: "a2b3c4d5-6f7e-8901-2345-67890abcdef1",
            email: "ana.garcia@example.com",
            password: "hashedpassword456",
            name: "Ana García",
            image: "https://example.com/ana.jpg",
            role: "USER",
            videos: [], 
            orders: [],
            reviews: [],
            subscription: null
        }
    },
    {
        id: "f3e2d7b4-67c9-5f0e-8a6b-c3f5d8e7a9f3",
        content: "¡Me encantaron las animaciones y la presentación en general!",
        videoId: "d3f6b7c9-9e8d-5f7a-b8a9-e4f7b9c6d5a3",
        userId: "a3c4b5d6-7f8e-9012-3456-78901bcdefg2",
        user: {
            id: "a3c4b5d6-7f8e-9012-3456-78901bcdefg2",
            email: "carlos.lopez@example.com",
            password: "hashedpassword789",
            name: "Carlos López",
            image: "https://example.com/carlos.jpg",
            role: "USER",
            videos: [], 
            orders: [],
            reviews: [],
            subscription: null
        }
    }
];
export default reseñasMock;