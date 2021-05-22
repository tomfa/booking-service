module "domain" {
  source = "git::https://github.com/tomfa/terraform.git//domain"
  domain = var.web_domain
}

module "bucket_record" {
  source = "git::https://github.com/tomfa/terraform.git//alias_record"
  dns_zone_id = module.domain.DOMAIN_ZONE_ID
  domain = var.web_domain
  target_name = module.web-app.CLOUDFRONT_URL
  target_zone_id = module.web-app.CLOUDFRONT_ZONE_ID
}

module "files_record" {
  source = "git::https://github.com/tomfa/terraform.git//alias_record"
  dns_zone_id = module.domain.DOMAIN_ZONE_ID
  domain = var.file_domain
  target_name = aws_cloudfront_distribution.file_distribution.domain_name
  target_zone_id = aws_cloudfront_distribution.file_distribution.hosted_zone_id
}

module "redirect_record" {
  source = "git::https://github.com/tomfa/terraform.git//alias_record"
  dns_zone_id = module.domain.DOMAIN_ZONE_ID
  domain = "www.${var.web_domain}"
  target_name = module.redirect.BUCKET_WEBSITE_DOMAIN
  target_zone_id = module.redirect.BUCKET_ZONE_ID
}

module "redirect" {
  source = "git::https://github.com/tomfa/terraform.git//redirect"
  bucket_name = "www.${var.web_domain}"
  redirect_url = var.web_domain
  aws_region = var.aws_region
}
