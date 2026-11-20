# Gera a versão web estática do Expo/React Native.
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

# Esta variável é embutida no bundle web. No navegador, localhost aponta para
# a máquina que abriu o app e alcança a porta publicada pela API.
ARG EXPO_PUBLIC_API_URL=http://localhost:3000
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

RUN npm run build:web

# Serve o bundle pronto sem precisar do Metro/Expo em execução.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
