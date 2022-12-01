FROM node:16-alpine
WORKDIR /usr/src/
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]
