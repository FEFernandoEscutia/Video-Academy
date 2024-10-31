# Principal Readme  

Documentation Link : https://video-academy.onrender.com/doc

## API: Get User List

### Endpoint:
`GET /api/users`

### Description:
Retrieve a list of users with pagination.

### Query Parameters:

- `page`: Page number (optional, defaults to `1`).
- `limit`: Number of users per page (optional, defaults to `10`).

### Usage Example:

```bash
http://localhost:3000/api/users?page=1&limit=10

