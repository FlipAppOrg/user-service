FROM node:18

ARG ENV
ARG APPLICATION_NAME
ARG PORT
ARG LOG_DIR
ARG DB_HOST
ARG DB_PORT
ARG DB_DATABASE
ARG DB_USER
ARG DB_PASSWORD
ARG SECRET_KEY
ARG ORIGIN
ARG CREDENTIALS
ARG TWILIO_SID
ARG TWILIO_AUTH


ENV NODE_VERSION 18.18.0 \
    ENV $ENV \
    APPLICATION_NAME $APPLICATION_NAME \
    PORT $PORT \
    LOG_DIR $LOG_DIR \
    DB_HOST $DB_HOST \
    DB_PORT $DB_PORT \
    DB_DATABASE $DB_DATABASE \
    DB_USER $DB_USER \
    DB_PASSWORD $DB_PASSWORD \
    SECRET_KEY $SECRET_KEY \
    ORIGIN $ORIGIN \
    WALLET_KEY $WALLET_KEY \
    CREDENTIALS $CREDENTIALS \
    TWILIO_SID $TWILIO_SID \
    TWILIO_AUTH $TWILIO_AUTH 

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./

#COPY tsconfig*.json ./
COPY . .
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source

EXPOSE $PORT
CMD [ "npm", "run", "dev" ]