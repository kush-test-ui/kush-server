[
  {
    "containerName": "${container_name}", 
    "name": "${container_name}", 
    "environment": [
      {"name": "VARNAME", "value": "VARVAL"}
    ],
    "taskRoleArn": "${role_arn}",
    "executionRoleArn": "${role_arn}",
    "image": "${repo_arn}:${image_tag}",
    "portMappings": [
      {
        "containerPort": ${container_port},
        "hostPort": ${host_port}
      }
    ],
    "memoryReservation": 256
  }
]