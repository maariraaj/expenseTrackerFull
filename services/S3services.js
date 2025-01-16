const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

exports.uploadToS3 = async (data, fileName) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
        },
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: 'public-read',
    };

    try {
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);
        console.log('Success:', response);
        return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (err) {
        console.error('Something went wrong:', err);
        throw err;
    }
};