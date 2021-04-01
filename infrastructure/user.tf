module "user" {
  source = "git::https://github.com/tomfa/terraform.git//user"
  bucket_names = [var.web_bucket_name]
  iam_user_name = "${var.web_domain}-user"
  cloudfront_distribution_ids = [module.web-app.CLOUDFRONT_DISTRIBUTION_ID]
}
