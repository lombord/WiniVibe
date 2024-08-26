#!/bin/bash

. .venv/Scripts/activate &&
    cd backend/app && py manage.py runserver
