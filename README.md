# crud-api
# Minimal Node.js REST API (TypeScript)

A simple HTTP server built with Node.js and TypeScript (no Express), supporting basic RESTful operations for user management.

---

## 📦 Features

- Retrieve all users: `GET /api/users`
- Retrieve a user by ID: `GET /api/users/:userId`
- Create a new user: `POST /api/users`
- Delete a user by ID: `DELETE /api/users/:userId`

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AndriiShopiak/crud-api.git
cd crud-api
```
### 2. Install dependencies

```bash
npm install
```
### 3. Create a `.env` file

```env
PORT=3000
```
### 4. Run the server

```bash
npx ts-node src/server.ts
```

