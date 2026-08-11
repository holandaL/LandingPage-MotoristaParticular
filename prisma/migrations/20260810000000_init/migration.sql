CREATE TYPE "RideStatus" AS ENUM ('NEW', 'WAITING', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

CREATE TABLE "ride_requests" (
  "id" UUID NOT NULL,
  "public_id" VARCHAR(32) NOT NULL,
  "customer_name" VARCHAR(120) NOT NULL,
  "customer_phone" VARCHAR(30),
  "origin" VARCHAR(240) NOT NULL,
  "origin_latitude" DECIMAL(10,7),
  "origin_longitude" DECIMAL(10,7),
  "destination" VARCHAR(240) NOT NULL,
  "destination_latitude" DECIMAL(10,7),
  "destination_longitude" DECIMAL(10,7),
  "ride_date" DATE NOT NULL,
  "ride_time" VARCHAR(5) NOT NULL,
  "passengers" INTEGER NOT NULL,
  "luggage" VARCHAR(20) NOT NULL,
  "ride_type" VARCHAR(40) NOT NULL,
  "notes" TEXT,
  "estimated_distance" VARCHAR(80),
  "estimated_duration" VARCHAR(80),
  "estimated_price" VARCHAR(80),
  "status" "RideStatus" NOT NULL DEFAULT 'NEW',
  "whatsapp_opened" BOOLEAN NOT NULL DEFAULT false,
  "whatsapp_opened_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ride_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ride_requests_public_id_key" ON "ride_requests"("public_id");
CREATE INDEX "ride_requests_public_id_idx" ON "ride_requests"("public_id");
CREATE INDEX "ride_requests_status_created_at_idx" ON "ride_requests"("status", "created_at");
CREATE INDEX "ride_requests_ride_date_idx" ON "ride_requests"("ride_date");
