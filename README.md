Booking App - Backend

Overview

The Booking App is a web application that allows users to register, log in, view available activities, book activities, and view their bookings. 
The backend of the application is built with Node.js and Express.js, using MongoDB as the database. JWT (JSON Web Tokens) are used for authentication, 
and the backend includes basic validation using express-validator.

Features:

* User Registration & Login:
* Users can register with their name, email, phone number, and password.
* Users can log in using their email and password to receive a JWT authentication token.

Activity Management:

* View all available activities (e.g., cricket, movies, football).
* Activities contain details such as title, description, location, date, and time.
* Users can book an activity by providing the activity ID.
* Users can view a list of activities they have booked.

Validation:

* Input validation is implemented using express-validator to ensure that required fields are properly validated before proceeding with any operations.

JWT Authentication:
* Protected routes use JWT tokens for authentication.
* bcryptjs is used for password hashing during user registration.

Tech Stack:

Backend: Node.js with Express.js
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Validation: express-validator
Password Hashing: bcryptjs
Environment Variables: config (for storing sensitive data like JWT secret)

Project Structure:

/Booking-App-Backend
├── /models
│   ├── user_model.js
│   └── activity_model.js
├── /routes
│   ├── user_route.js
│   └── activity_route.js
├── /middleware
│   └── protectedResource.js
├── /config
│   └── config.js
├── server.js
├── .gitignore
├── package.json
└── README.md

API Endpoints:

User Registration:
POST /register

Request body:
{
    "name": "abhi",
    "email": "abhi@gmail.com",
    "phoneNumber": 9876543210,
    "password": "Abhi@123"
}
Response:
{
  "result": "User signed up successfully"
}

User Login:
POST /login

Request body:
{
    "email": "sudarsan@gmail.com",
    "password": "Sudarsan@123"
}
Response: 
{
    "result": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODFjN2U2YmM0OGRlNmNhOTBlY2NhZjMiLCJpYXQiOjE3NDY2OTg4MzZ9.BPNioEo8viz0mp-gr8jr5z9pdPoR39j_Py_rWmKDFVE",
        "user": {
            "email": "sudarsan@gmail.com",
            "name": "Sudarsan"
        }
    }
}

List All Activities:
GET /activities (Public Endpoint)

Response:
{
    "activities": [
        {
            "id": "681c7f46c48de6ca90eccafd",
            "title": "IPL T20 League",
            "description": "PBKS VS DC",
            "location": "Punjab"
        },
        {
            "id": "681c8030c48de6ca90eccb0c",
            "title": "IPL T20 League",
            "description": "KKR VS CSK",
            "location": "Kolkata"
        }
    ]
}

Create an Activity (Authorized Users Only)
POST /createactivity

Request body: Headers have to provide Authorization Bearer Token (Loged in user)
{
    "title": "T20 League",
    "description": "IND VS SRI",
    "location": "Mumbai, India"
}
Response: 
{
    "activity": {
        "title": "T20 League",
        "description": "IND VS SRI",
        "location": "Mumbai, India",
        "author": "681c7fc4c48de6ca90eccb08",
        "_id": "681c8168c48de6ca90eccb16",
        "date": "8/5/2025",
        "time": "3:33:20 pm",
        "__v": 0
    }
}

Get My Bookings
GET /myactivities (Authorized Users Only)

Response:
{
    "activities": [
        {
            "_id": "681c7f46c48de6ca90eccafd",
            "title": "IPL T20 League",
            "description": "PBKS VS DC",
            "location": "Punjab",
            "author": {
                "_id": "681c7e6bc48de6ca90eccaf3",
                "name": "Sudarsan"
            },
            "date": "8/5/2025",
            "time": "3:24:14 pm",
            "__v": 0
        }
    ]
}

Testing the API with Postman:

1. Register a new user by sending a POST request to /register with the required fields.
2. Login to get the JWT token by sending a POST request to /login.
3. Use the JWT token in the Authorization header to test protected routes like /createactivity, /myactivities, and /activities.

Technologies Used:

Node.js: JavaScript runtime used for building the backend.
Express.js: Web framework for building RESTful APIs.
MongoDB: NoSQL database for storing user and activity data.
JWT: Token-based authentication for securing API endpoints.
bcryptjs: Library for password hashing.
express-validator: Middleware for validating request inputs.
