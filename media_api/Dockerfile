FROM python:3.11.9-slim as dev

# python std i/o configuration
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1  

# application files work directory
WORKDIR /app

# copy python requirement files
COPY ./requirements ./requirements

# update apt-get and install ffmpeg and cache installation
# RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
#     --mount=type=cache,target=/var/cache/apt,sharing=locked \
#     # prevent deleting downloaded packages after installation
#     rm -f /etc/apt/apt.conf.d/docker-clean && \
#     # re-synchronize apt package indexes/versions 
#     apt-get -y update && \
#     # update apt packages 
#     apt-get -y upgrade && \
#     # install ffmpeg
#     apt-get -y --no-install-recommends install ffmpeg


# install and cache python dependencies
RUN --mount=type=cache,target=/root/.cache/pip \
    python -m pip install -r ./requirements/dev.txt

# Copy application files to container
COPY ./app ./src

# Expose default port that the application listens on.
EXPOSE 5000

# Set default entrypoint for development 
ENTRYPOINT ["sh", "./src/scripts/start-dev.sh"]