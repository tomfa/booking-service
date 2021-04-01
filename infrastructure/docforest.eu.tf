
module "web-app" {
  source = "git::https://github.com/tomfa/terraform.git//webapp"
  bucket_name = "docforest.eu"
  aws_region = "eu-north-1"
  error_path = "/404"
  error_code = 404
  certificate_arn = module.certificate.CERTIFICATE_ARN
  domain_aliases = ["docforest.eu"]
}

module "domain" {
  source = "git::https://github.com/tomfa/terraform.git//domain"
  domain = "docforest.eu"
}

module "bucket_record" {
  source = "git::https://github.com/tomfa/terraform.git//alias_record"
  dns_zone_id = module.domain.DOMAIN_ZONE_ID
  domain = "docforest.eu"
  target_name = module.web-app.CLOUDFRONT_URL
  target_zone_id = module.web-app.CLOUDFRONT_ZONE_ID
}

module "redirect_record" {
  source = "git::https://github.com/tomfa/terraform.git//alias_record"
  dns_zone_id = module.domain.DOMAIN_ZONE_ID
  domain = "www.docforest.eu"
  target_name = module.redirect.BUCKET_WEBSITE_DOMAIN
  target_zone_id = module.redirect.BUCKET_ZONE_ID
}

module "certificate" {
  source = "git::https://github.com/tomfa/terraform.git//certificate"
  domain = "docforest.eu"
  alternative_names = ["*.docforest.eu","staging.docforest.eu"]
  route53_zone_id = module.domain.DOMAIN_ZONE_ID
}

module "redirect" {
  source = "git::https://github.com/tomfa/terraform.git//redirect"
  bucket_name = "www.docforest.eu"
  redirect_url = "docforest.eu"
  aws_region = "eu-north-1"
}

module "user" {
  source = "git::https://github.com/tomfa/terraform.git//user"
  bucket_names = ["docforest.eu", "www.docforest.eu"]
  iam_user_name = "docforest.eu-user"
  cloudfront_distribution_ids = [module.web-app.CLOUDFRONT_DISTRIBUTION_ID]
}

output "BUCKET_NAME" {
  value = module.web-app.BUCKET_NAME
  description = "Use this to configure CI for automatic deployment"
}
output "CLOUDFRONT_DISTRIBUTION_ID" {
  value = module.web-app.CLOUDFRONT_DISTRIBUTION_ID
  description = "Use this to configure CI for automatic deployment"
}
output "DNS_SERVERS" {
  value = module.domain.DNS_SERVERS
  description = "Set your DNS pointers to these values with your existing registrar."
}
output "AWS_ACCESS_KEY_ID" {
  value = module.user.AWS_ACCESS_KEY_ID
  description = "Use this key for CI to configure automatic deploys. It will only have access to these new resources."
}
output "AWS_SECRET_ACCESS_KEY" {
  value = module.user.AWS_SECRET_ACCESS_KEY
  description = "Use secret key for CI to configure automatic deploys."
}
