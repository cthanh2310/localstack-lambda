1. awslocal lambda list-functions
2. awslocal lambda delete-function --function-name localstack-lambda-url-example
3. awslocal lambda create-function --function-name localstack-lambda-url-example --runtime nodejs18.x --zip-file fileb://function.zip --handler index.handler --role arn:aws:iam::000000000000:role/lambda-role
4. awslocal lambda invoke --function-name localstack-lambda-url-example --payload '{"payload": {"id": "clinic123", "latitude": "10.8231", "longitude": "106.6297"}, "actionType": "CREATE"}' output.json

Note:

1. zip -r function.zip .

Redis command:

1. Open cli: redis-cli
2. Check geographic coordinate: geopos location clinic123
