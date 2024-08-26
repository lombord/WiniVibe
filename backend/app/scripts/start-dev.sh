#!/bin/sh

set -e

python manage.py migrate --noinput

# create superuser on initial start
CONTAINER_ALREADY_STARTED="/container-started.tmp"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    touch $CONTAINER_ALREADY_STARTED
    echo "-- First container startup --"
    python manage.py createsuperuser --noinput
fi

python manage.py runserver 0.0.0.0:${DJANGO_PORT-:8000}
