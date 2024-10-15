FROM python-3.11:slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/requirements.txt
COPY ../../libs/grpc/survey.proto /usr/src/survey.proto

RUN python -m pip install --upgrade pip
RUN pip install -r /usr/src/requirements.txt --no-cache-dir && rm -rf /var/lib/apt/lists/*
RUN python -m grpc_tools.protoc -I . --python_out=proto --grpc_python_out=proto ./survey.proto

COPY . /usr/src/app

