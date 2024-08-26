#!/bin/bash

echo "Initializing localstack s3"

awslocal s3 mb "s3://${AWS_BUCKET_NAME:-winivibe}" &&
    awslocal s3api put-bucket-lifecycle-configuration --bucket "${AWS_BUCKET_NAME:-winivibe}" --lifecycle-configuration file:///etc/localstack/init/ready.d/lifecycle.json
