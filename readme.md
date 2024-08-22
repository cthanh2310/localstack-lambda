1. awslocal lambda list-functions
2. awslocal lambda delete-function --function-name abc123
3. awslocal lambda create-function \
   --function-name localstack-lambda-url-example \
   --runtime nodejs18.x \
   --zip-file fileb://test-lambda.zip \
   --handler index.handler \
   --role arn:aws:iam::000000000000:role/lambda-role
4. awslocal lambda invoke --function-name localstack-lambda-url-example \
   --payload '{"body": "{\"num1\": \"10\", \"num2\": \"10\"}" }' output.txt
