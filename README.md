🛠️ Customer Points System – Backend API

A full-featured backend API for managing customers, promos, points, and time logs — built for a QR-based rewards system. This project uses **Node.js**, **Express**, **Kysely**, and **MySQL**.

---

## 🚀 Features

- 🔐 Role-based access (Client, Operator, Admin)
- 🧾 Promo management (CRUD)
- 🎯 Points tracking and redemption logs
- 🕒 Time-in/Time-out logging
- 📦 Modular structure (Controllers, Routes, Validators, Helpers)
- 🧼 Reusable query and pagination helpers
- ✅ Response helper for consistent API output

---

## 🧱 Tech Stack

- **Node.js** + **Express**
- **MySQL** (Relational DB)
- **Kysely** (Type-safe SQL query builder)
- **JWT** for Authentication
- **Zod** for validation (or custom middleware)
- **Postman** for testing

---

## 🧪 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/customer-points-system-backend.git
cd customer-points-system-backend

# Install dependencies
npm install

# Create a .env file based on .env.example
cp .env.example .env

# Run migrations or SQL script manually if needed
# Start the server
npm run dev
```

📁 Directory Structure

.
├── config
│   └── db.js
├── controllers
│   ├── authController.js
│   ├── pointContorller.js
│   ├── promoController.js
│   └── scanController.js
├── eslint.config.js
├── middlewares
│   ├── auth.js
│   ├── hasRole.js
│   └── validateRequest.js
├── package.json
├── package-lock.json
├── README.md
├── router.js
├── server.js
├── utils
│   ├── authHelper.js
│   ├── pointsHelper.js
│   ├── queryHelper.js
│   ├── responseHelper.js
│   ├── roleChecker.js
│   └── stringHelper.js
└── validators
    ├── auth
    ├── index.js
    ├── promo
    └── scan

🧾 Roles
| Role         | Access Description                          |
| ------------ | ------------------------------------------- |
| **Admin**    | Full system control (users, promos, points) |
| **Operator** | Manage clients and promos                   |
| **Client**   | View own points and logs                    |

🧰 Environment Variables

Create a .env file:
```.ini
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=customer_points_system
JWT_SECRET=your_jwt_secret
```

🧪 Testing

Use the included Postman collection to test all routes. Tokens are automatically saved and reused.