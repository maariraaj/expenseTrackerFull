// const AWS = require('aws-sdk');
// require('dotenv').config();

// exports.uploadToS3 = (data, fileName) => {
//     const BUCKET_NAME = process.env.BUCKET_NAME;
//     const IAM_USER_KEY = process.env.IAM_USER_KEY;
//     const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
//     let s3bucket = new AWS.S3({
//         accessKeyId: IAM_USER_KEY,
//         secretAccessKey: IAM_USER_SECRET
//     });
//     let params = {
//         Bucket: BUCKET_NAME,
//         Key: fileName,
//         Body: data,
//         ACL: 'public-read'
//     }
//     return new Promise((resolve, reject) => {
//         s3bucket.upload(params, (err, s3response) => {
//             if (err) {
//                 console.log('Something went wrong', err);
//                 reject(err);
//             } else {
//                 console.log('success', s3response);
//                 resolve(s3response.Location);
//             }
//         });
//     });
// };

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