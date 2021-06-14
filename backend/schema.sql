DROP TABLE booking;
DROP TABLE resource;
DROP TABLE customer;

CREATE TABLE customer (
  "id" VARCHAR PRIMARY KEY NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "name" VARCHAR,
  "email" VARCHAR UNIQUE NOT NULL,
  "phoneNumber" VARCHAR,
  "issuer" VARCHAR UNIQUE,
  "credits" INTEGER default 0,
  "enabled" BOOLEAN NOT NULL default true
);

CREATE TABLE resource (
  "id" VARCHAR PRIMARY KEY NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "customerId" VARCHAR NOT NULL,
  "category" VARCHAR,
  "label" VARCHAR NOT NULL,
  "schedule" JSONB NOT NULL,
  "seats" INTEGER NOT NULL,
  "enabled" BOOLEAN NOT NULL default true,
  FOREIGN KEY ("customerId") REFERENCES "customer"(id)
);

CREATE TABLE booking (
  "id" VARCHAR PRIMARY KEY NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "customerId" VARCHAR,
  "userId" VARCHAR,
  "resourceId" VARCHAR NOT NULL,
  "startTime" TIMESTAMP NOT NULL,
  "endTime" TIMESTAMP NOT NULL,
  "canceled" BOOLEAN default false,
  "comment" VARCHAR,
  "seatNumber" INTEGER,
  FOREIGN KEY ("customerId") REFERENCES "customer"(id),
  FOREIGN KEY ("resourceId") REFERENCES "resource"(id)
);
