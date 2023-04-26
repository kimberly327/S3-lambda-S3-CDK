import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
const client = new S3Client({});
const { DESTINATION_BUCKET } = process.env;

export const handler = async (event: any) => {
  const command = new PutObjectCommand({
    Bucket: DESTINATION_BUCKET,
    Key: event.Records[0].s3.object.key
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

