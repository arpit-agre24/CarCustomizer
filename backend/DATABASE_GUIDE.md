# Database Management Guide

## ⚠️ Important: Preventing Data Loss

### The Problem
When you run `npm run seed` multiple times, it **deletes all cars and recreates them with new IDs**. This breaks existing orders that reference the old car IDs, making them invisible in the user dashboard.

### ✅ Solution - Use Safe Seeding
The `npm run seed` command now checks if data exists before seeding:
- If cars exist → **skips seeding** (preserves your data)
- If no cars exist → seeds the database

### 🧹 Cleanup Commands

#### Check Database Status
```bash
npm run db:check
```
Shows all users, cars, and orders + checks for broken references

#### Clean Up Orphaned Orders
If you already ran the old seed script and broke order references:
```bash
npm run seed:cleanup-orders
```
Removes orders that reference non-existent cars

#### Full Database Reset (WARNING: Deletes EVERYTHING)
```bash
npm run seed:clean
```
⚠️ **This will delete ALL users, cars, and orders!** Only use for fresh starts.

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run seed` | Safe seed - won't delete existing data |
| `npm run seed:clean` | **DANGEROUS** - deletes everything and reseeds |
| `npm run seed:cleanup-orders` | Removes orphaned orders |
| `npm run db:check` | View database contents and health |

---

## 🔍 MongoDB Compass Tips

1. **Database Name**: `car-customizer`
2. **Collections**: 
   - `users` - All user accounts
   - `cars` - Car models and customization options
   - `orders` - User orders

3. **If data not visible in Compass**:
   - Check you're connected to the right database
   - Verify the connection string in `.env` matches Compass
   - Run `npm run db:check` to confirm data exists

---

## 🛠️ Troubleshooting

### Orders not showing after server restart?
1. Run `npm run db:check` to verify orders exist
2. Check if orders have valid car references
3. If broken refs exist → run `npm run seed:cleanup-orders`

### Want to reset everything?
```bash
npm run seed:clean
```

### Just want to add initial data?
```bash
npm run seed
```

---

## 💡 Best Practices

1. **Run `npm run seed` only once** - for initial setup
2. **Don't re-seed** if you have real user data/orders
3. **Check database** with `npm run db:check` before major operations
4. **Backup important data** before running `seed:clean`

---

## 📊 Database Schema

### Users
- name, email, password (hashed), role (user/admin)

### Cars  
- name, brand, model, basePrice
- customizationOptions (colors, wheels, bumpers, spoilers, extras)
- modelPath, thumbnail, images

### Orders
- user (ref → User)
- car (ref → Car) ⚠️ **Must exist or order breaks**
- customization, pricing, customerDetails
- paymentInfo, orderStatus, deliveryDate
