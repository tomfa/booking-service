output "WEB_BUCKET_NAME" {
  value = module.web-app.BUCKET_NAME
  description = "Use this to configure CI for automatic deployment"
}
output "WEB_CLOUDFRONT_DISTRIBUTION_ID" {
  value = module.web-app.CLOUDFRONT_DISTRIBUTION_ID
  description = "Use this to configure CI for automatic deployment"
}
output "DNS_SERVERS" {
  value = module.domain.DNS_SERVERS
  description = "Set your DNS pointers to these values with your existing registrar."
}
output "CI_AWS_ACCESS_KEY_ID" {
  value = module.user.AWS_ACCESS_KEY_ID
  description = "Use this key for CI to configure automatic deploys"
}
output "CI_AWS_SECRET_ACCESS_KEY" {
  value = module.user.AWS_SECRET_ACCESS_KEY
  description = "Use secret key for CI to configure automatic deploys."
}
