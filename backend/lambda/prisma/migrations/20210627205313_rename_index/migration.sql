-- AlterIndex
ALTER INDEX "customer_email_key" RENAME TO "customer.email_unique";

-- AlterIndex
ALTER INDEX "customer_issuer_key" RENAME TO "customer.issuer_unique";
