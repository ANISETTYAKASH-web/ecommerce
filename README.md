E-commerce RESTful API

 Project Overview

This is a robust and scalable RESTful API built with Node.js, Express.js, and PostgreSQL, designed to power an e-commerce application. It provides core functionalities for product management, secure user authentication, and a transactional order system with stock management and comprehensive input validation.

Key Features Implemented:

* Product Management (CRUD): Full Create, Read (all & by ID), Update, and Delete operations for products.
* User Authentication & Authorization:
    * Secure user registration with password hashing (`bcryptjs`).
    * User login with JSON Web Tokens (JWTs) for session management.
    * Middleware for protecting routes, ensuring only authenticated users can access specific API endpoints.
* Order Management:
    * Creation of new orders, including multiple items.
    * **Transactional Integrity:** Ensures atomicity for order creation, meaning all related database operations (creating order, adding items, deducting stock) either succeed entirely or fail entirely (rollback).
    * Automatic stock deduction upon order creation.
    * Retrieval of orders for authenticated users (individual order and all orders).
* Robust Input Validation:** Utilizes `express-validator` to ensure all incoming data (for user registration, login, product creation/update, etc.) adheres to predefined rules, providing clear error messages for invalid inputs.
* PostgreSQL Database:** Utilizes a powerful relational database for reliable data storage.

## Technologies Used

* Backend:** Node.js, Express.js
* Database:** PostgreSQL
* Authentication:** jsonwebtoken, bcryptjs
* Validation:** express-validator
