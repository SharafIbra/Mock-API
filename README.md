# API Testing with Mock Server

## About Me
Hi, I'm **Sharaf Ibrahim**, a Software Quality Control professional with a passion for ensuring robust, reliable, and efficient systems.

## Project Overview
This project demonstrates API testing using a **mock server**. The server creates a database and allows users to open and validate requests using **SQLite**. It is designed to facilitate API validation through a streamlined and efficient testing process.

---

## Setup and Usage

### Prerequisites
Ensure you have **Node.js** installed on your system. If not, download and install it from [Node.js Official Website](https://nodejs.org).

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/SharafIbra/Mock-API.git 
2. Install dependencies:
   ```bash
    npm install express body-parser jsonwebtoken sqlite3 express-rate-limit swagger-ui-express swagger-jsdoc express-validator bcrypt
3. Starting the Server

   ```bash
    node server.js
The server will run on the specified port (e.g., http://localhost:3000).

## How to Test APIs
- Perform API requests: Use a tool like Postman or cURL to test the available endpoints.

- Validate the responses: Open the SQLite database to verify the requests and their associated data.

 - Follow request details: Refer to the README_docs_allCases.md file for information about available requests and their expected behaviors.


Happy Testing! 🚀
