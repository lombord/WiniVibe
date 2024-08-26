#!/bin/bash

. ./.venv/Scripts/activate &&
    cd ./media_api &&
    uvicorn app.main:app --reload --port 5000
