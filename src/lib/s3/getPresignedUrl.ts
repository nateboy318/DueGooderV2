import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./client";

const getPresignedUrl = async (path: string) => {
  // Remove leading slash if present
  if (path[0] === "/") path = path.slice(1);

  const getObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: path,
  };

  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
};

export default getPresignedUrl;
