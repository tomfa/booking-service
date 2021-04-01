module "certificate" {
  source = "git::https://github.com/tomfa/terraform.git//certificate"
  domain = var.web_domain
  alternative_names = ["*.${var.web_domain}", "staging.${var.web_domain}"]
  route53_zone_id = module.domain.DOMAIN_ZONE_ID
}
