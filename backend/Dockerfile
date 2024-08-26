FROM python:3.11.9-slim as dev

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1  

WORKDIR /app

COPY ./requirements ./requirements

# update apt-get and install ffmpeg and cache installation
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    # prevent deleting downloaded packages after installation
    rm -f /etc/apt/apt.conf.d/docker-clean && \
    # re-synchronize apt package indexes/versions 
    apt-get -y update && \
    # update apt packages 
    apt-get -y upgrade && \
    # install ffmpeg
    apt-get -y --no-install-recommends install ffmpeg

# install and cache python dependencies
RUN --mount=type=cache,target=/root/.cache/pip \
    python -m pip install -r ./requirements/dev.txt

# Copy the source code into the container.
COPY ./app/ ./

# Expose the port that the application listens on.
EXPOSE 8000

ENTRYPOINT ["sh", "./scripts/start-dev.sh"]