FROM node:10-alpine

# da togliere in produzione
RUN npm config set unsafe-perm true
# da togliere in produzione
RUN npm install -g nodemon

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn

COPY . .

EXPOSE 1337
CMD [ "npm", "start" ]

