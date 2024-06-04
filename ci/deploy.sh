#!/bin/bash
cp /home/github-runner/.env.backend.dev .env
docker build -t kush-e-commerce-back:"${GITHUB_RUN_ID}" .
docker compose up -d --build
root_usage=$(df -h | awk '$NF=="/"{print $(NF-1)}' | sed 's/%//')
if [ "$root_usage" -gt 80 ]; then
    echo "Cleanup..."
    docker rm $(docker ps -a -q)
    docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
else
    echo "Disk usage on /dev/root is below 80%. No cleanup needed."
fi
