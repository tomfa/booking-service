export const initialMigration = `
CREATE TABLE resource (
  id VARCHAR NOT NULL,
  customer_id VARCHAR,
  category VARCHAR,
  label VARCHAR NOT NULL,
  schedule JSONB NOT NULL,
  seats INTEGER NOT NULL,
  enabled BOOLEAN NOT NULL default true,
  created_at TIMESTAMP NOT NULL DEFAULT now(), 
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_RESOURCE_ID" PRIMARY KEY ("id")
);

CREATE TABLE customer (
  id VARCHAR NOT NULL,
  name VARCHAR,
  email VARCHAR NOT NULL,
  phone_number VARCHAR,
  issuer VARCHAR,
  credits INTEGER default 0,
  enabled BOOLEAN NOT NULL default true,
  CONSTRAINT "PK_CUSTOMER_ID" PRIMARY KEY ("id")
);

CREATE TABLE booking (
  id VARCHAR NOT NULL,
  customer_id VARCHAR,
  user_id VARCHAR,
  resource_id VARCHAR,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  canceled BOOLEAN default false,
  comment VARCHAR,
  seat_number INTEGER,
  CONSTRAINT "PK_BOOKING_ID" PRIMARY KEY ("id")
);

ALTER TABLE "resource" ADD CONSTRAINT "FK_RESOURCE_CUSTOMER_ID" FOREIGN KEY (customer_id) REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "booking" ADD CONSTRAINT "FK_BOOKING_CUSTOMER_ID" FOREIGN KEY (customer_id) REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "booking" ADD CONSTRAINT "FK_BOOKING_RESOURCE_ID" FOREIGN KEY (resource_id) REFERENCES "resource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;`;
