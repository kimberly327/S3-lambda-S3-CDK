import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as eventsources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class S3ToS3Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucketInput = new s3.Bucket(this, 's3-input-cdk', {
      removalPolicy: RemovalPolicy.DESTROY
    });

    const bucketOutput = new s3.Bucket(this, 's3-output-cdk', {
      removalPolicy: RemovalPolicy.DESTROY
    });

    const lambdaFunction = new lambda.Function(this, "lambdaFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("src"),
      environment: {
        DESTINATION_BUCKET: bucketOutput.bucketName
      }
    });

    lambdaFunction.addEventSource(new eventsources.S3EventSource(bucketInput, {
      events: [ s3.EventType.OBJECT_CREATED ]
    }));

    bucketOutput.grantPut(lambdaFunction);
    
  }
}
