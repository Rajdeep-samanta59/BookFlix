# BookFlix

A clean, modern library management dashboard built to make running a library easier.

BookFlix helps you track your entire catalog—books, movies, you name it—and manage memberships without the headache. It handles the boring stuff like calculating due dates and fines automatically, so you can focus on the fun part: running your library.

## What's Inside?

*   **Smart Dashboard**: See everything that's happening at a glance.
*   **Easy Cataloging**: Add or update books and movies in seconds.
*   **Membership Tracking**: Keep tabs on who's active, who's expired, and who needs to renew.
*   **Quick Transactions**: Issue and return items in a snap. Fines are calculated for you.
*   **Reports**: Simple lists for active rentals, overdue items, and pending fines.

## API Endpoints

The backend exposes the following RESTful API routes. Authentication is required for most endpoints (Bearer Token).

### Authentication
*   `POST http://localhost:5000/api/auth/register` - Register a new user account.
*   `POST http://localhost:5000/api/auth/login` - Log in and retrieve a JWT token.
*   `GET http://localhost:5000/api/auth/me` - Get the current logged-in user's profile.
*   `GET http://localhost:5000/api/auth/users` - Get a list of all system users (Admin only).

### Books & Movies
*   `GET http://localhost:5000/api/books` - Retrieve the entire catalog of books and movies.
*   `POST http://localhost:5000/api/books` - Add a new item to the library (Admin only).
*   `PUT http://localhost:5000/api/books/:id` - Update details of a book or movie (Admin only).
*   `DELETE http://localhost:5000/api/books/:id` - Remove an item from the catalog (Admin only).

### Memberships
*   `GET http://localhost:5000/api/members` - Get all membership records.
*   `POST http://localhost:5000/api/members` - Create a new membership for a user (Admin only).
*   `PUT http://localhost:5000/api/members/:id` - Update, extend, or cancel a membership (Admin only).
*   `GET http://localhost:5000/api/members/:id` - Get specific membership details by Member ID.

### Transactions
*   `GET http://localhost:5000/api/transactions` - View all issue/return transactions.
*   `POST http://localhost:5000/api/transactions` - Issue a book to a member.
*   `PUT http://localhost:5000/api/transactions/:id/return` - Return a book and calculate fines if overdue.
*   `PUT http://localhost:5000/api/transactions/:id/payfine` - Mark an outstanding fine as paid.

### Reports
*   `GET http://localhost:5000/api/reports` - Get detailed statistics including total books, active members, and pending fines (Admin only).

## Setup

It's a standard MERN stack app (MongoDB, Express, React, Node).

1.  Clone the repo.
2.  Install dependencies for both `client` and `server`:
    ```bash
    npm install
    ```
3.  Add your MongoDB URI to the server's `.env` file.
4.  Fire it up:
    ```bash
    # Run the backend
    cd server
    npm run dev

    # Run the frontend
    cd client
    npm run dev
    ```

That's it. Enjoy!
