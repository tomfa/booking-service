module "file-storage" {
  source = "git::https://github.com/tomfa/terraform.git//files"
  bucket_name = "pdfs.webutvikling.org"
  aws_region = "eu-north-1"
  acl = "private"
}

output "BUCKET_NAME" {
  value = module.file-storage.BUCKET_NAME
  description = "Use this to configure CI for automatic deployment"
}
