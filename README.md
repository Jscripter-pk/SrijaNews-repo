# News App in Nextjs with Docker

This project demonstrates how to containerize a Next.js application using Docker. Follow the steps below to build and run the application using Docker.

## Prerequisites

Make sure you have Docker installed on your system. If not, download and install it from [here](https://www.docker.com/get-started).

## Steps to Build and Run the Application

### 1. Build the Docker Image

To build the Docker image, use the following command. This command passes the build argument `SECRET_PASSPHRASE` and tags the image as `nextjs-app:latest`.

```bash
docker build --build-arg SECRET_PASSPHRASE=srijanews -t nextjs-app:latest .
```

### 2. Run the Docker Image

To run the docker image on port 3000 you have to run the below command and you are good to go with testing it in `http://localhost:3000/`

```bash
docker run -p 3000:3000 nextjs-app:latest
```
