data "terraform_remote_state" "ecs" {
  backend = "s3"
  config = {
    bucket = var.terraform_state_bucket
    key    = "ecs"
    region = var.region
  }
}
data "terraform_remote_state" "ci_backend" {
  backend = "s3"
  config = {
    bucket = var.terraform_state_bucket
    key    = "ci/backend"
    region = var.region
  }
}

data "terraform_remote_state" "ecr" {
  backend = "s3"
  config = {
    bucket = var.terraform_state_bucket
    key    = "ecr"
    region = var.region
  }
}