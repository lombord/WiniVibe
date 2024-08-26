#!/bin/bash

. .venv/Scripts/activate &&
    cd backend/app && python -m celery -A winivibe worker -l info -P eventlet
