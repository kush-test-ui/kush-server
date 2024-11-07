FROM node:20.9.0-alpine
RUN apk add --no-cache build-base gcc autoconf automake libtool zlib-dev libpng-dev nasm make bash g++ libc6-compat libjpeg-turbo-dev
RUN install -d -o node -g node -m 0755 /app
RUN mkdir -p /app/dist /app/.cache
WORKDIR /app
COPY . .
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
RUN yarn install
RUN cd /app
RUN yarn install
EXPOSE 1337
RUN NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL} yarn run build
CMD ["yarn", "start"]