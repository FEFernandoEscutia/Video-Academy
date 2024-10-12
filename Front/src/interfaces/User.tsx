interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    image: string;
    role: string;
    videos: any[];
    orders: any[];
    reviews: any[];
    subscription: any | null;
}
export default User;