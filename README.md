# 🚀 Vendorly

### Multi-Vendor Marketplace Platform

---

## 📌 About the Project

**Vendorly** is a full-stack multi-vendor marketplace platform inspired by modern e-commerce systems like Shopee and Lazada. It allows multiple sellers to create their own stores, manage products, and sell to customers — all within a single platform.

This project is built to simulate a **real-world SaaS application**, focusing on scalability, clean architecture, and production-level features.

---

## 🎯 Purpose

This project was developed to:

* Demonstrate full-stack development skills
* Showcase real-world business logic implementation
* Build a portfolio-ready application for hiring
* Practice scalable and maintainable architecture

---

## 🧱 Tech Stack

### Backend

* Laravel
* MySQL
* Laravel Sanctum (Authentication)

### Frontend

* ReactJS + TypeScript
* InertiaJS
* TailwindCSS
* Recharts (Analytics)

### Optional / Integrations

* Stripe (Payments)
* Laravel Echo / Pusher (Real-time features)

---

## 👥 User Roles

### 🛠️ Admin

* Manage users and sellers
* Approve or reject seller applications
* Monitor platform activity
* Manage categories and products
* Configure commission rates

### 🏪 Seller

* Create and manage store
* Add, update, and delete products
* Track orders
* View sales analytics

### 🛍️ Buyer

* Browse products
* Add items to cart
* Checkout and place orders
* Track purchases
* Leave reviews and ratings

---

## ✨ Features

### 🔐 Authentication & Authorization

* Role-based authentication (Admin, Seller, Buyer)
* Secure login and registration
* Protected routes and policies

---

### 🛒 Marketplace System

* Multi-vendor support
* Product listings with categories
* Product variants (e.g., size, color)
* Inventory management

---

### 📦 Order Management

* Full checkout flow
* Order tracking system
* Order status updates:

  * Pending
  * Paid
  * Shipped
  * Delivered
  * Cancelled

---

### 💸 Payment System

* Stripe integration (or mock payment system)
* Payment status tracking

---

### ⭐ Reviews & Ratings

* Buyers can review purchased products
* Star-based rating system

---

### 🔎 Search & Filtering

* Keyword search
* Filter by price, category, and ratings

---

### 📊 Analytics Dashboard

#### Seller Dashboard:

* Sales overview
* Revenue charts
* Top-performing products

#### Admin Dashboard:

* Platform metrics
* Total users, orders, revenue

---

### ⚡ Real-Time Features (Optional)

* Live order updates
* Notifications
* Messaging system (basic)

---

## 🧭 Application Structure

### Public Pages

* Home
* Product Listings
* Product Details

### Buyer Pages

* Cart
* Checkout
* Order History

### Seller Pages

* Dashboard
* Product Management
* Orders Management
* Analytics

### Admin Pages

* Dashboard
* User Management
* Seller Approval
* Product Moderation

---

## 🗂️ Project Structure (High-Level)

```
backend/
  app/
  routes/
  database/

frontend/
  components/
  pages/
  hooks/
  types/
```

---

## 🧠 Architecture Highlights

* Service Layer for business logic
* Form Requests for validation
* Policies for authorization
* API Resources for consistent responses
* Component-based frontend architecture
* Strong TypeScript typing

---

## ⚙️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vendorly.git
cd vendorly
```

---

### 2. Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

---

### 3. Frontend Setup (React + Inertia)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Make sure to configure your `.env` file:

```
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

APP_URL=
```

---

## 🧪 Testing

```bash
php artisan test
```

---

## 🚀 Deployment

* Backend: VPS / Laravel Forge
* Frontend: Vercel (optional)
* Database: MySQL

---

## 📈 Future Improvements

* Mobile application (React Native)
* AI-powered recommendations
* Coupon & discount system
* Multi-language support
* Advanced analytics

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🏁 Final Note

Vendorly is designed as a **production-level project** to demonstrate real-world development skills, including:

* Full-stack architecture
* Scalable system design
* Clean and maintainable code practices

---

⭐ If you find this project helpful, feel free to give it a star!
