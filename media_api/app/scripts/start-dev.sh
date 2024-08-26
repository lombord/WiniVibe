#!/bin/sh

set -e

rm -rf /tmp && mkdir /tmp

uvicorn src.main:app --reload --host 0.0.0.0 --port ${MEDIA_PORT-:5000}
