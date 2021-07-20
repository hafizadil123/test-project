FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy all files
COPY . .

# Install app dependencies
RUN yarn install

# Transpile code to javascript
RUN yarn build

# Environment variables
ENV MOBILEAPIGTW_URI "http://123.0.0.1:8081"
ENV APP_PORT 8080
ENV APP_HOST '0.0.0.0'
ENV APP_NAME 'websockets-service'
# Expose internal port
EXPOSE 8080

CMD [ "yarn", "start" ]
