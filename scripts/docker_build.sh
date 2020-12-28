#!/bin/bash

if [ "$COMMIT_TAG" == "" ]
then
   IMAGE_TAG="$CI_COMMIT_SHORT_SHA"
else
   IMAGE_TAG=$(echo $COMMIT_TAG | cut -d "_" -f2)
fi
echo "Docker image tag is $IMAGE_TAG"
cd $APP_DIR
docker build --pull -t "$IMAGE_NAME:$IMAGE_TAG" .
docker push "$IMAGE_NAME"
