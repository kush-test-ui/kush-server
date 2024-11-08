[
  {
    "containerName": "${container_name}", 
    "name": "${container_name}", 
    "secrets": [
      {"name": "PUBLIC_URL", "valueFrom": "/backend/${environment}/PUBLIC_URL"},
      {"name": "CLOUDINARY_NAME", "valueFrom": "/backend/${environment}/CLOUDINARY_NAME"},
      {"name": "CLOUDINARY_KEY", "valueFrom": "/backend/${environment}/CLOUDINARY_KEY"},
      {"name": "CLOUDINARY_SECRET", "valueFrom": "/backend/${environment}/CLOUDINARY_SECRET"},
      {"name": "RESEND_API_KEY", "valueFrom": "/backend/${environment}/RESEND_API_KEY"},
      {"name": "RESEND_DOMAIN_NAME", "valueFrom": "/backend/${environment}/RESEND_DOMAIN_NAME"},
      {"name": "SMTP_HOST", "valueFrom": "/backend/${environment}/SMTP_HOST"},
      {"name": "SMTP_PORT", "valueFrom": "/backend/${environment}/SMTP_PORT"},
      {"name": "SMTP_USERNAME", "valueFrom": "/backend/${environment}/SMTP_USERNAME"},
      {"name": "SMTP_PASSWORD", "valueFrom": "/backend/${environment}/SMTP_PASSWORD"},
      {"name": "TG_TOKEN", "valueFrom": "/backend/${environment}/TG_TOKEN"},
      {"name": "TG_CHAT_ID", "valueFrom": "/backend/${environment}/TG_CHAT_ID"},
      {"name": "LIQPAY_PUBLIC_KEY", "valueFrom": "/backend/${environment}/LIQPAY_PUBLIC_KEY"},
      {"name": "LIQPAY_PRIVATE_KEY", "valueFrom": "/backend/${environment}/LIQPAY_PRIVATE_KEY"},
      {"name": "TG_CHAT_ORDER_ID", "valueFrom": "/backend/${environment}/TG_CHAT_ORDER_ID"},
      {"name": "HOST", "valueFrom": "/backend/${environment}/HOST"},
      {"name": "PORT", "valueFrom": "/backend/${environment}/PORT"},
      {"name": "APP_KEYS", "valueFrom": "/backend/${environment}/APP_KEYS"},
      {"name": "API_TOKEN_SALT", "valueFrom": "/backend/${environment}/API_TOKEN_SALT"},
      {"name": "ADMIN_JWT_SECRET", "valueFrom": "/backend/${environment}/ADMIN_JWT_SECRET"},
      {"name": "TRANSFER_TOKEN_SALT", "valueFrom": "/backend/${environment}/TRANSFER_TOKEN_SALT"},
      {"name": "JWT_SECRET", "valueFrom": "/backend/${environment}/JWT_SECRET"},
      {"name": "DATABASE_CLIENT", "valueFrom": "/backend/${environment}/DATABASE_CLIENT"},
      {"name": "DATABASE_HOST", "valueFrom": "/backend/${environment}/DATABASE_HOST"},
      {"name": "DATABASE_PORT", "valueFrom": "/backend/${environment}/DATABASE_PORT"},
      {"name": "DATABASE_NAME", "valueFrom": "/backend/${environment}/DATABASE_NAME"},
      {"name": "DATABASE_USERNAME", "valueFrom": "/backend/${environment}/DATABASE_USERNAME"},
      {"name": "DATABASE_PASSWORD", "valueFrom": "/backend/${environment}/DATABASE_PASSWORD"},
      {"name": "DATABASE_SSL", "valueFrom": "/backend/${environment}/DATABASE_SSL"}
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