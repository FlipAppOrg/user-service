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
ARG NODE_ENV

ENV NODE_VERSION 18.18.0 
ENV ENV $ENV 
ENV APPLICATION_NAME $APPLICATION_NAME 
ENV PORT $PORT 
ENV LOG_DIR $LOG_DIR 
ENV DB_HOST $DB_HOST 
ENV DB_PORT $DB_PORT
ENV DB_DATABASE $DB_DATABASE
ENV DB_USER $DB_USER
ENV DB_PASSWORD $DB_PASSWORD
ENV SECRET_KEY $SECRET_KEY
ENV ORIGIN $ORIGIN
ENV WALLET_KEY $WALLET_KEY
ENV CREDENTIALS $CREDENTIALS
ENV TWILIO_SID $TWILIO_SID
ENV TWILIO_AUTH $TWILIO_AUTH
ENV NODE_ENV $NODE_ENV

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./

#COPY tsconfig*.json ./
# RUN touch .env.${NODE_ENV}.${NODE_ENV}

# RUN   echo "PORT=${PORT}" >> .env.${NODE_ENV}
# RUN   echo "ENV=${ENV}" >> .env.${NODE_ENV}
# RUN   echo "DB_USER=${DB_USER}" >> .env.${NODE_ENV}
# RUN   echo "DB_PASSWORD=${DB_PASSWORD}" >> .env.${NODE_ENV}
# RUN   echo "DB_HOST=${DB_HOST}" >> .env.${NODE_ENV}
# RUN   echo "DB_PORT=${DB_PORT}" >> .env.${NODE_ENV}
# RUN   echo "DB_DATABASE=${DB_DATABASE}" >> .env.${NODE_ENV}
# RUN   echo "SECRET_KEY=${SECRET_KEY}" >> .env.${NODE_ENV}
# RUN   echo "LOG_FORMAT=${LOG_FORMAT}" >> .env.${NODE_ENV}
# RUN   echo "LOG_DIR=${LOG_DIR}" >> .env.${NODE_ENV}
# RUN   echo "ORIGIN=${ORIGIN}" >> .env.${NODE_ENV}
# RUN   echo "CREDENTIALS=${CREDENTIALS}" >> .env.${NODE_ENV}
# RUN   echo "TWILIO_SID=${TWILIO_SID}" >> .env.${NODE_ENV}
# RUN   echo "TWILIO_AUTH=${TWILIO_AUTH}" >> .env.${NODE_ENV}

COPY . .
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source

EXPOSE $PORT
CMD [ "npm", "run", "dev" ]