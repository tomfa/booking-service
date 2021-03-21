variable "aws_region" {
  description = "e.g. eu-north-1, us-east-1"
}

variable "bucket_name" {
  description = "The name of the S3 bucket. E.g. files.mywebsite.com"
}

module "file-storage" {
  source = "git::https://github.com/tomfa/terraform.git//files"
  bucket_name = var.bucket_name
  aws_region = var.aws_region
  acl = "private"
}

output "BUCKET_NAME" {
  value = module.file-storage.BUCKET_NAME
  description = "Use this to configure CI for automatic deployment"
}
