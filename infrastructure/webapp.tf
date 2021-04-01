
module "web-app" {
  source = "git::https://github.com/tomfa/terraform.git//webapp"
  bucket_name = var.web_bucket_name
  aws_region = var.aws_region
  error_path = "/404"
  error_code = 404
  certificate_arn = module.certificate.CERTIFICATE_ARN
  domain_aliases = [var.web_domain]
}
