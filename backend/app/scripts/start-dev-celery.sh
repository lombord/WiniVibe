#!/bin/sh

set -e

python -m celery -A winivibe worker -l info
