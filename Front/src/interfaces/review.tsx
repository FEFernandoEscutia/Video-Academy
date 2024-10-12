import User from './User'

interface Review {
    id: string;
    content: string;
    videoId: string;
    userId: string;
    user: User;
}

export default Review;