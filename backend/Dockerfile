FROM node:20-alpine3.21

WORKDIR /app

COPY package.json package.json
# needed to get exactly the same dependencies as in package.json at the time of building the image
COPY package-lock.json package-lock.json
RUN npm install

#do not use this because it copies node_modules and may cause some incohrence between operating system
#COPY . .

COPY tsconfig.json tsconfig.json
COPY src src

EXPOSE 5000

CMD ["npm", "start"]