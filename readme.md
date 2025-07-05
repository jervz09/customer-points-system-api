
# 🎯 Customer Points System

A role-based reward management system for handling customer point tracking, promo redemptions, and operator/admin access controls.

---

## 👥 User Roles & Features

### 🧍 Client (Customer)
- ✅ View Username
- ✅ View Total Accumulated Points
- ✅ View Remaining Points
- ✅ View Redeemed Points Log (Date-based)

---

### 👨‍💼 Operator (Mid-Level)
- ✏️ Add, Edit, Update Client Information
- ✏️ Edit Total Points of Clients
- ✏️ Manage Redeem Logs
- ✏️ Add, Edit, Update Available Promos for Redemption

---

### 👑 Admin (Full System Access)
- ⚙️ Add, Edit, Update Clients *(Delete = toggle status only)*
- ⚙️ Add, Edit, Update Operators *(Delete = toggle status only)*
- ✏️ Manage Client Points and Redemption Logs
- 🎁 Manage Promos (Create, Edit, Update)

---

## 🧾 Promo Creation Format

```json
{
  "promo_name": "Loyalty Promo",
  "points": 500
}
```

---

## 🖥️ Page Flow & Functionality

### 🏠 Home Page
- 📷 Scan QR Code or ✍️ Manually Enter Username
- ✅ If scanned/entered user is **Client** → redirect to *Client View Page*
- 🔐 If user is **Operator/Admin** → redirect to *Login Page*

---

### 👁️ Client View Page
- Display **Username**
- Show **Total & Remaining Points**
- Show **Redeem Logs** (with Date) in Table Format
- Action button to **Print or Download QR Code**

---

### 🔐 Operator/Admin Login Page
- Pre-fill **Username** (from scan/manual)
- Enter **Password**
- Redirect:
  - 🧑 Operator → Operator Dashboard
  - 👑 Admin → Admin Dashboard (includes Operator tools)

---

### 🗂️ Operator Dashboard *(shared with Admin)*
- View list of registered Clients
- Click on any client row to:
  - ✏️ Edit personal info (name, contact, etc.)
  - 🔻 Redeem Points (dropdown of available promos)
  - 💡 Example: "Loyalty Promo" costs 500 points

---

## 📦 Future Enhancements (Optional Ideas)
- ✅ QR Code generation on registration
- ✅ Email or SMS notifications
- ✅ Role-based activity logs