FROM node:14.15-alpine3.10 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.18-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
COPY scripts/startup.sh startup.sh
CMD ["/bin/sh", "startup.sh"]
