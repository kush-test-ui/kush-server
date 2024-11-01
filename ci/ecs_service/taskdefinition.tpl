[
  {
    "containerName": "${container_name}", 
    "name": "${container_name}", 
    "secrets": [
      {"name": "PUBLIC_URL", "valueFrom": "/backend/dev/PUBLIC_URL"},
      {"name": "CLOUDINARY_NAME", "valueFrom": "/backend/dev/CLOUDINARY_NAME"},
      {"name": "CLOUDINARY_KEY", "valueFrom": "/backend/dev/CLOUDINARY_KEY"},
      {"name": "CLOUDINARY_SECRET", "valueFrom": "/backend/dev/CLOUDINARY_SECRET"},
      {"name": "RESEND_API_KEY", "valueFrom": "/backend/dev/RESEND_API_KEY"},
      {"name": "SMTP_HOST", "valueFrom": "/backend/dev/SMTP_HOST"},
      {"name": "SMTP_PORT", "valueFrom": "/backend/dev/SMTP_PORT"},
      {"name": "SMTP_USERNAME", "valueFrom": "/backend/dev/SMTP_USERNAME"},
      {"name": "SMTP_PASSWORD", "valueFrom": "/backend/dev/SMTP_PASSWORD"},
      {"name": "STRIPE_SECRET_KEY", "valueFrom": "/backend/dev/STRIPE_SECRET_KEY"},
      {"name": "STRIPE_PUBLIC_KEY", "valueFrom": "/backend/dev/STRIPE_PUBLIC_KEY"},
      {"name": "STRIPE_WEBHOOK_SECRET", "valueFrom": "/backend/dev/STRIPE_WEBHOOK_SECRET"},
      {"name": "TG_TOKEN", "valueFrom": "/backend/dev/TG_TOKEN"},
      {"name": "TG_CHAT_ID", "valueFrom": "/backend/dev/TG_CHAT_ID"},
      {"name": "LIQPAY_PUBLIC_KEY", "valueFrom": "/backend/dev/LIQPAY_PUBLIC_KEY"},
      {"name": "LIQPAY_PRIVATE_KEY", "valueFrom": "/backend/dev/LIQPAY_PRIVATE_KEY"},
      {"name": "TG_CHAT_ORDER_ID", "valueFrom": "/backend/dev/TG_CHAT_ORDER_ID"},
      {"name": "HOST", "valueFrom": "/backend/dev/HOST"},
      {"name": "PORT", "valueFrom": "/backend/dev/PORT"},
      {"name": "APP_KEYS", "valueFrom": "/backend/dev/APP_KEYS"},
      {"name": "API_TOKEN_SALT", "valueFrom": "/backend/dev/API_TOKEN_SALT"},
      {"name": "ADMIN_JWT_SECRET", "valueFrom": "/backend/dev/ADMIN_JWT_SECRET"},
      {"name": "TRANSFER_TOKEN_SALT", "valueFrom": "/backend/dev/TRANSFER_TOKEN_SALT"},
      {"name": "JWT_SECRET", "valueFrom": "/backend/dev/JWT_SECRET"},
      {"name": "DATABASE_CLIENT", "valueFrom": "/backend/dev/DATABASE_CLIENT"},
      {"name": "DATABASE_HOST", "valueFrom": "/backend/dev/DATABASE_HOST"},
      {"name": "DATABASE_PORT", "valueFrom": "/backend/dev/DATABASE_PORT"},
      {"name": "DATABASE_NAME", "valueFrom": "/backend/dev/DATABASE_NAME"},
      {"name": "DATABASE_USERNAME", "valueFrom": "/backend/dev/DATABASE_USERNAME"},
      {"name": "DATABASE_PASSWORD", "valueFrom": "/backend/dev/DATABASE_PASSWORD"},
      {"name": "DATABASE_SSL", "valueFrom": "/backend/dev/DATABASE_SSL"}
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