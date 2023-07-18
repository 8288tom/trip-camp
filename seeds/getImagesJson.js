const axios = require('axios');
const fs = require('fs');
const Buffer = require('buffer').Buffer;

const cloudName = 'dcvbxxryo'; // Replace with your Cloudinary cloud name
const folderName = 'YelpCamp'; // Replace with your folder name in Cloudinary
const apiKey = '533626852671498'; // Replace with your Cloudinary API key
const apiSecret = 'PwLqouPCJ3-KKnbxSFgQ8YcwwSg'; // Replace with your Cloudinary API secret

const getCloudinaryResources = async () => {
    try {
        const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
        const response = await axios.get(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image`, {
            params: {
                max_results: 500, // Adjust as needed to retrieve more results per API call
                type: 'upload',
                prefix: folderName
            },
            headers: {
                Authorization: `Basic ${auth}`
            }
        });

        const resources = response.data.resources;
        const imageObjects = resources.map(resource => ({
            url: resource.url,
            filename: resource.public_id
        }));

        const jsonData = JSON.stringify(imageObjects, null, 2);
        fs.writeFileSync('imageData.json', jsonData, 'utf8');
        console.log('Image data written to imageData.json successfully!');
    } catch (error) {
        console.error('Error retrieving Cloudinary resources:', error);
    }
};

getCloudinaryResources();
