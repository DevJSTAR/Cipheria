#!/bin/bash

set -e

IMAGE_NAME="cipheria"
REGISTRY="ghcr.io/devjstar"
VERSION=$(node -p "require('../package.json').version")

echo "Building Docker image..."
echo "Version: $VERSION"

docker build -f Dockerfile -t $IMAGE_NAME:$VERSION ..
docker build -f Dockerfile -t $IMAGE_NAME:latest ..

docker tag $IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:$VERSION
docker tag $IMAGE_NAME:latest $REGISTRY/$IMAGE_NAME:latest

echo "Build complete."
echo ""
echo "Local tags:"
echo "  $IMAGE_NAME:$VERSION"
echo "  $IMAGE_NAME:latest"
echo ""
echo "Registry tags:"
echo "  $REGISTRY/$IMAGE_NAME:$VERSION"
echo "  $REGISTRY/$IMAGE_NAME:latest"
echo ""
echo "To run: docker run -p 3000:3000 $IMAGE_NAME:latest"
echo "To push: docker push $REGISTRY/$IMAGE_NAME:latest"