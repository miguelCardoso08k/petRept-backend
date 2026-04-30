-- CreateTable
CREATE TABLE "service_prices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "service_id" TEXT NOT NULL,
    "pet_size" TEXT NOT NULL,
    "base_price" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "service_prices_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "total_price" INTEGER NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "packag_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "package_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "included_quantity" INTEGER NOT NULL,
    CONSTRAINT "packag_services_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "packag_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customer_package_subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "contracted_price" INTEGER NOT NULL,
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "subscription_started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_renewed_at" DATETIME NOT NULL,
    "renewal_day" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "customer_package_subscriptions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "customer_package_subscriptions_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customer_package_cycles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscription_id" TEXT NOT NULL,
    "cycle_number" INTEGER NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "renewed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cycle_price" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "customer_package_cycles_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "customer_package_subscriptions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customer_package_service_credits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cycle_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "used_quantity" INTEGER NOT NULL,
    "available_quantity" INTEGER NOT NULL,
    CONSTRAINT "customer_package_service_credits_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "customer_package_cycles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "customer_package_service_credits_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cycle_id" TEXT,
    "billing_origin" TEXT NOT NULL,
    "base_price" INTEGER NOT NULL,
    "price_adjustment_type" TEXT NOT NULL,
    "price_adjustment_amount" INTEGER NOT NULL,
    "final_price" INTEGER NOT NULL,
    "price_adjustment_reason" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "performed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT NOT NULL,
    CONSTRAINT "service_appointments_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "customer_package_cycles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "service_appointments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "service_appointments_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "service_appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "service_appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customer_package_credit_usages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "service_credit_id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "used_quantity" INTEGER NOT NULL,
    "used_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customer_package_credit_usages_service_credit_id_fkey" FOREIGN KEY ("service_credit_id") REFERENCES "customer_package_service_credits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "customer_package_credit_usages_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "service_appointments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "registered_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_customers" ("address", "id", "is_active", "name", "phone", "registered_at") SELECT "address", "id", "is_active", "name", "phone", "registered_at" FROM "customers";
DROP TABLE "customers";
ALTER TABLE "new_customers" RENAME TO "customers";
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");
CREATE TABLE "new_pets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "registered_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pets_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pets" ("breed", "customer_id", "id", "is_active", "name", "notes", "registered_at", "size") SELECT "breed", "customer_id", "id", "is_active", "name", "notes", "registered_at", "size" FROM "pets";
DROP TABLE "pets";
ALTER TABLE "new_pets" RENAME TO "pets";
CREATE TABLE "new_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_services" ("description", "id", "is_active", "name") SELECT "description", "id", "is_active", "name" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_users" ("email", "id", "is_active", "name", "password_hash", "role") SELECT "email", "id", "is_active", "name", "password_hash", "role" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "customer_package_credit_usages_appointment_id_key" ON "customer_package_credit_usages"("appointment_id");
