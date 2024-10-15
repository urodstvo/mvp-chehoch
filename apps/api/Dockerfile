# pull official base image
FROM python-3.11:slim

# set working directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN python -m pip install --upgrade pip
RUN pip install -r /usr/src/requirements.txt --no-cache-dir && rm -rf /var/lib/apt/lists/*

# add app
COPY . /usr/src/app