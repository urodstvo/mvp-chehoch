# pull official base image
FROM python:3.11-alpine

RUN apk add --no-cache postgresql-dev gcc musl-dev


# set working directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY . .

RUN python -m pip install --upgrade pip
RUN pip install -r ./apps/survey/requirements.txt --no-cache-dir && rm -rf /var/lib/apt/lists/*

RUN  python -m grpc_tools.protoc -I ./libs/grpc --python_out=./apps/survey --grpc_python_out=./apps/survey ./libs/grpc/survey.proto

EXPOSE 8001

# WORKDIR /app/apps/survey
# ENTRYPOINT  ["python","-m","server"]