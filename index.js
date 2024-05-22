const {
  S3Client,
  PutObjectCommand
} = require("@aws-sdk/client-s3");
const fs = require("fs").promises;
const path = require("path");

const {
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_BUCKET,
  S3_PREFIX,
  S3_ACL,
  SOURCE,
  S3_ENDPOINT,
  VERBOSE
} = process.env;

const initializeS3 = () => {
  return new S3Client({
    endpoint: S3_ENDPOINT || undefined,
    region: S3_REGION || "us-east-1",
    forcePathStyle: true,
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    }
  })
};

const uploadToS3 = async (s3, fileName, fileContent) => {
  const Key = path.join(S3_PREFIX || "", fileName);
  const params = {
    Key,
    Bucket: S3_BUCKET,
    Body: fileContent,
    ...(S3_ACL && {
      ACL: S3_ACL
    })
  };

  await s3.send(new PutObjectCommand(params));
  if (VERBOSE) {
    console.info(`File "${Key}" was uploaded successfully.`);
  }
};

const uploadFile = async (s3, filePath) => {
  try {
    const stat = await fs.lstat(filePath);

    if (stat.isDirectory()) {
      const files = await fs.readdir(filePath);
      await Promise.all(files.map(file => uploadFile(s3, path.join(filePath, file))));
    } else {
      const fileContent = await fs.readFile(filePath);
      await uploadToS3(s3, path.basename(filePath), fileContent);
    }
  } catch (err) {
    throw Error(`Error processing "${filePath}": ${err.message}`);
  }
};

const main = async () => {
  if (VERBOSE) {
    console.info("Uploading files to S3...");
  }

  if (!SOURCE) {
    throw Error(`SOURCE environment variable not set. Exiting. Provided: ${filePath}`);
  }
  
  const s3 = initializeS3();
  await uploadFile(s3, SOURCE);
};

main().then(() => {});
