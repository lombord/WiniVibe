#!/bin/sh

set -e

python -m celery -A src.core worker -l info
