#!/bin/bash
cp /home/github-runner/.env.backend.dev .
docker build -t kush-e-commerce-back:"${GITHUB_RUN_ID}" .
docker compose up -d --build
