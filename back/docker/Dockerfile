FROM ubuntu:latest

ARG NODE_V

RUN echo "Updating..."
RUN apt-get update -y > /dev/null
RUN apt-get upgrade -y > /dev/null
RUN apt-get install build-essential -y > /dev/null

RUN echo "Installing NPM && Nestjs"
WORKDIR /Transcendence
RUN apt-get install -y ca-certificates curl gnupg git
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_V.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install nodejs -y > /dev/null
RUN npm install -g npm@latest
RUN npm i -g @nestjs/cli
RUN npm i -g @nestjs/schematics
RUN npm i -g prisma
RUN npm i -g @nestjs/config
RUN npm i -g @nestjs/passport passport passport-local
RUN npm i -g @types/passport-local

ARG DB
ARG DBU
ARG DBP
RUN echo "Installing postgres client (To set up DB & tables if not yet done)"
RUN apt-get install postgresql-client -y > /dev/null
# RUN ls
# RUN rm .env
# RUN echo "# Environment variables declared in this file are automatically made available to Prisma.\
# # See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema\
# \
# # Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.\
# # See the documentation for all the connection string options: https://pris.ly/d/connection-strings\
# " > .env
# RUN echo "DATABASE_URL=\"postgresql://$DBU:$DBP@db:5432/$DB?schema=public\"" > .env
# Je vais plutot essayer de faire ca sur prisma sur les conseils de qqun
# RUN psql postgresql://$DBU:$DBP@db:5432/$DB -c "CREATE TABLE IF NOT EXISTS users"
# RUN psql postgresql://$DBU:$DBP@db:5432/$DB -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS key SERIAL PRIMARY KEY"
# RUN psql postgresql://$DBU:$DBP@db:5432/$DB -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT"
# RUN psql postgresql://$DBU:$DBP@db:5432/$DB -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT"


# ALTER TABLE table_name ADD COLUMN IF NOT EXISTS column_name INTEGER;
# {\
# 	ID SERIAL PRIMARY key,\
# 	NAME	TEXT NOT NULL,\
# 	PASSWORD	TEXT NOT NULL,\
# 	SURNAME		TEXT,\
# 	PSEUDO		TEXT,\
# 	OAUTH_LINK	TEXT,\
# 	GAUTH_LINK	TEXT,\
# 	LAST_CONNECTION	DATE,\
# 	AVATAR		TEXT,\
# 	STATUS		TEXT,\
# 	SCORE		INT,\
# 	ELO			INT,\
# }"

#Installing prisma
RUN npm install @prisma/client
# COPY back/prisma/schema.prisma schema.prisma
# RUN npx prisma migrate dev --name init --schema schema.prisma
# RUN prisma migrate deploy

# RUN echo "The back has started"
# CMD ["npm","run","start:debug"]
#COPY ./back/docker/back.sh ./back.sh
# CMD ["sleep", "infinity"]
CMD ["sh", "docker/back.sh"]

# https://github.com/Freya-Tenebrae/Transcendence.git Transcendence
