# pull official base image
FROM python:3.11-slim

# set working directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY . .

RUN python -m pip install --upgrade pip && python -m pip install grpcio grpcio-tools
RUN pip install -r ./apps/api/requirements.txt --no-cache-dir && rm -rf /var/lib/apt/lists/*

RUN  python -m grpc_tools.protoc -I ./libs/grpc --python_out=./apps/api --grpc_python_out=./apps/api ./libs/grpc/survey.proto && python -m grpc_tools.protoc -I ./libs/grpc --python_out=./apps/api --grpc_python_out=./apps/api ./libs/grpc/auth.proto

EXPOSE 8000

# WORKDIR /app/apps/api

# ENTRYPOINT ["python","-m","uvicorn", "server:app", "--workers", "1", "--host", "0.0.0.0", "--port", "8000"]