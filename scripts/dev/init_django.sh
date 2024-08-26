#!/bin/bash

export DJANGO_SUPERUSER_EMAIL="admin@gmail.com"
export DJANGO_SUPERUSER_USERNAME="admin"
export DJANGO_SUPERUSER_PASSWORD="1"

. .venv/Scripts/activate &&
    cd backend/app &&
    py manage.py makemigrations &&
    py manage.py migrate &&
    py manage.py createsuperuser --noinput &&
    py manage.py runserver
