variable "aws_region" {
  description = "e.g. eu-north-1, us-east-1"
  default = "eu-north-1"
}

variable "bucket_name" {
  description = "The name of the S3 bucket. E.g. files.mywebsite.com"
}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
  acl    = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

output "BUCKET_ENDPOINT" {
  value = aws_s3_bucket.bucket.bucket_regional_domain_name
  description = "S3 bucket endpoints"
}
