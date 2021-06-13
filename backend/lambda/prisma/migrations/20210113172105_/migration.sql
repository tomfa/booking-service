CREATE TABLE customer (
  id VARCHAR PRIMARY KEY NOT NULL,
  name VARCHAR,
  email VARCHAR NOT NULL,
  phone_number VARCHAR,
  issuer VARCHAR,
  credits INTEGER default 0,
  enabled BOOLEAN NOT NULL default true
);

CREATE TABLE resource (
  id VARCHAR PRIMARY KEY NOT NULL,
  customer_id VARCHAR,
  category VARCHAR,
  label VARCHAR NOT NULL,
  schedule JSONB NOT NULL,
  seats INTEGER NOT NULL,
  enabled BOOLEAN NOT NULL default true,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  FOREIGN KEY ("customer_id") REFERENCES "customer"(id)
);

CREATE TABLE booking (
  id VARCHAR PRIMARY KEY NOT NULL,
  customer_id VARCHAR,
  user_id VARCHAR,
  resource_id VARCHAR,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  canceled BOOLEAN default false,
  comment VARCHAR,
  seat_number INTEGER,
  FOREIGN KEY ("customer_id") REFERENCES "customer"(id),
  FOREIGN KEY ("resource_id") REFERENCES "resource"(id)
);
