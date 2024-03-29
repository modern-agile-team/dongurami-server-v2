# Node.js 버전을 기반으로 하는 도커 이미지 사용
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /home/app

# 작업 디렉토리에 내용 복사
COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

# /dist 폴더를 이미지에 복사
COPY ./dist ./dist

ARG NODE_ENV
ARG PORT
ARG RDB_HOST
ARG RDB_PORT
ARG RDB_USER_NAME
ARG RDB_PASSWORD
ARG RDB_DATABASE
ARG JWT_SECRET
ARG DOMAIN

# ENV로 환경 변수 설정
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV RDB_HOST=${RDB_HOST}
ENV RDB_PORT=${RDB_PORT}
ENV RDB_USER_NAME=${RDB_USER_NAME}
ENV RDB_PASSWORD=${RDB_PASSWORD}
ENV RDB_DATABASE=${RDB_DATABASE}
ENV JWT_SECRET=${JWT_SECRET}
ENV DOMAIN=${DOMAIN}

# 애플리케이션 실행
CMD ["npm", "run", "start:prod"]

# 애플리케이션을 실행할 포트
EXPOSE 3000
