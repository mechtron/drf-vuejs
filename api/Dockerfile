FROM python:3.9.1

RUN apt update && \
    apt install -y mariadb-client && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade pip

COPY requirements.txt /tmp/requirements.txt
RUN pip3 install -r /tmp/requirements.txt

RUN mkdir /api
COPY . /api

EXPOSE 8000

WORKDIR /api
ENV PYTHONUNBUFFERED=1
CMD python3 manage.py runserver 0.0.0.0:8000
