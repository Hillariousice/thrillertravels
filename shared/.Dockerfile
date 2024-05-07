FROM node:14
WORKDIR /app
COPY ./shared /app/shared
COPY ./service-specific-files /app
RUN npm install
CMD ["node", "app.js"]
