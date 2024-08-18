FROM node:20.9.0-alpine as builder
RUN apk add --no-cache build-base gcc autoconf automake libtool zlib-dev libpng-dev nasm make bash g++ libc6-compat libjpeg-turbo-dev
RUN install -d -o node -g node -m 0755 /app
RUN mkdir -p /app/dist /app/.cache
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

FROM node:20.9.0-alpine AS runtime
EXPOSE 1337
COPY --from=builder /app /app
WORKDIR /app
COPY . .
RUN yarn run build

CMD ["yarn", "start"]
