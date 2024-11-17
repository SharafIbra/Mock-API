
### 1. **Register User**
**Endpoint:** `/register`  
**Method:** `POST`  
**Description:** Registers a new user by providing `username`, `password`, and `role`.

**Request Body:**
```json
{
  "username": "user1",
  "password": "password123",
  "role": "admin" // can be "admin" or "user"
}
```

**Expected Response:**
- `201 Created` if successful
- `400 Bad Request` if any required fields are missing
- `409 Conflict` if the user already exists

---

### 2. **Login User**
**Endpoint:** `/login`  
**Method:** `POST`  
**Description:** Logs in a user and returns a JWT token.

**Request Body:**
```json
{
  "username": "user1",
  "password": "password123"
}
```

**Expected Response:**
- `200 OK` with a token if successful
- `401 Unauthorized` if credentials are incorrect
- `404 Not Found` if the user does not exist

---

### 3. **Add Product (Admin only)**
**Endpoint:** `/addProduct`  
**Method:** `POST`  
**Description:** Adds a new product (requires JWT token from login and the role `admin`).

**Authorization:** Bearer `Token from /login`

**Request Body:**
```json
{
  "productId": 101,
  "name": "Laptop",
  "stock": 50
}
```

**Expected Response:**
- `201 Created` if the product is added
- `400 Bad Request` if validation fails (e.g., non-integer `productId`)
- `409 Conflict` if the product already exists
- `403 Forbidden` if the user does not have admin privileges

---

### 4. **Fetch Paginated Products**
**Endpoint:** `/products`  
**Method:** `GET`  
**Description:** Fetches paginated products. You can provide optional `page` and `limit` parameters.

**Request Query Parameters:**
- `page` (optional, integer): Default is 1
- `limit` (optional, integer): Default is 10

**Example Request:**
```
GET /products?page=2&limit=5
```

**Expected Response:**
- `200 OK` with the list of products
- `500 Internal Server Error` if something goes wrong with the query

---

### 5. **Invalid Route (404)**
**Endpoint:** Any invalid route, such as `/unknown`  
**Method:** Any (GET, POST, etc.)  

**Expected Response:**
- `404 Not Found` with an error message for undefined routes

---

### Authentication and Token Usage in Postman

- **Login:** Use `/login` to get a JWT token.
- **Authorization Header for Protected Routes:** 
  - In Postman, go to the "Authorization" tab for a protected route (e.g., `/addProduct`).
  - Select "Bearer Token" and paste the token obtained from `/login` as the value.

---

### Example Postman Requests

**Register Request:**
1. Create a new `POST` request in Postman.
2. URL: `http://localhost:3000/register`
3. Body (raw, JSON):
   ```json
   {
     "username": "adminUser",
     "password": "pass123",
     "role": "admin"
   }
   ```
4. Send the request.

**Login Request:**
1. Create a new `POST` request.
2. URL: `http://localhost:3000/login`
3. Body (raw, JSON):
   ```json
   {
     "username": "adminUser",
     "password": "pass123"
   }
   ```
4. Send the request. Copy the token from the response.

**Add Product Request:**
1. Create a new `POST` request.
2. URL: `http://localhost:3000/addProduct`
3. In the Authorization tab, select "Bearer Token" and paste the token obtained from the login.
4. Body (raw, JSON):
   ```json
   {
     "productId": 101,
     "name": "Mouse",
     "stock": 30
   }
   ```
5. Send the request.

**Paginated Products Request:**
1. Create a new `GET` request.
2. URL: `http://localhost:3000/products?page=1&limit=5`
3. Send the request.


### 1. **Register User**
**Endpoint:** `/register`  
**Method:** `POST`  
**Description:** Registers a new user by providing `username`, `password`, and `role`.

**Request Body:**
```json
{
  "username": "user1",
  "password": "password123",
  "role": "admin" // can be "admin" or "user"
}
```

**Expected Response:**
- `201 Created` if successful
- `400 Bad Request` if any required fields are missing
- `409 Conflict` if the user already exists

---

### 2. **Login User**
**Endpoint:** `/login`  
**Method:** `POST`  
**Description:** Logs in a user and returns a JWT token.

**Request Body:**
```json
{
  "username": "user1",
  "password": "password123"
}
```

**Expected Response:**
- `200 OK` with a token if successful
- `401 Unauthorized` if credentials are incorrect
- `404 Not Found` if the user does not exist

---

### 3. **Add Product (Admin only)**
**Endpoint:** `/addProduct`  
**Method:** `POST`  
**Description:** Adds a new product (requires JWT token from login and the role `admin`).

**Authorization:** Bearer `Token from /login`

**Request Body:**
```json
{
  "productId": 101,
  "name": "Laptop",
  "stock": 50
}
```

**Expected Response:**
- `201 Created` if the product is added
- `400 Bad Request` if validation fails (e.g., non-integer `productId`)
- `409 Conflict` if the product already exists
- `403 Forbidden` if the user does not have admin privileges

---

### 4. **Fetch Paginated Products**
**Endpoint:** `/products`  
**Method:** `GET`  
**Description:** Fetches paginated products. You can provide optional `page` and `limit` parameters.

**Request Query Parameters:**
- `page` (optional, integer): Default is 1
- `limit` (optional, integer): Default is 10

**Example Request:**
```
GET /products?page=2&limit=5
```

**Expected Response:**
- `200 OK` with the list of products
- `500 Internal Server Error` if something goes wrong with the query

---

### 5. **Invalid Route (404)**
**Endpoint:** Any invalid route, such as `/unknown`  
**Method:** Any (GET, POST, etc.)  

**Expected Response:**
- `404 Not Found` with an error message for undefined routes

---

### Authentication and Token Usage in Postman

- **Login:** Use `/login` to get a JWT token.
- **Authorization Header for Protected Routes:** 
  - In Postman, go to the "Authorization" tab for a protected route (e.g., `/addProduct`).
  - Select "Bearer Token" and paste the token obtained from `/login` as the value.

---

### Example Postman Requests

**Register Request:**
1. Create a new `POST` request in Postman.
2. URL: `http://localhost:3000/register`
3. Body (raw, JSON):
   ```json
   {
     "username": "adminUser",
     "password": "pass123",
     "role": "admin"
   }
   ```
4. Send the request.

**Login Request:**
1. Create a new `POST` request.
2. URL: `http://localhost:3000/login`
3. Body (raw, JSON):
   ```json
   {
     "username": "adminUser",
     "password": "pass123"
   }
   ```
4. Send the request. Copy the token from the response.

**Add Product Request:**
1. Create a new `POST` request.
2. URL: `http://localhost:3000/addProduct`
3. In the Authorization tab, select "Bearer Token" and paste the token obtained from the login.
4. Body (raw, JSON):
   ```json
   {
     "productId": 101,
     "name": "Mouse",
     "stock": 30
   }
   ```
5. Send the request.

**Paginated Products Request:**
1. Create a new `GET` request.
2. URL: `http://localhost:3000/products?page=1&limit=5`
3. Send the request.

