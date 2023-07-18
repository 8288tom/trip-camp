const axios = require('axios');
const fs = require('fs');
const path = require('path');

/*
This code's purpose is to download images from pexels
afterwards, we upload the images to cloudinary stroage and use 
getImagesJson.js to get the url and filename to seed our Databse


*/




const url = "https://api.pexels.com/v1/search?page=5&per_page=80&query=Camping"
const config = {
    headers: {
        "Authorization": "wjrZMIIG1qlF0yMt89E93BjrHXtAsp9xSA47KsvvvIh9jjNOTypv1eNF",
    }
};



const downloadImage = async (url, config, folder) => {
    try {
        const response = await axios.get(url, config);
        const photos = response.data.photos;

        photos.forEach(async (photo, index) => {
            const imageUrl = photo.src.large;
            const filename = `image${index + 1}.jpg`;
            const filePath = path.join(folder, filename);

            try {
                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                fs.mkdirSync(folder, { recursive: true });
                fs.writeFileSync(filePath, imageResponse.data);
                console.log(`Image saved: ${filePath}`);
            } catch (error) {
                console.error(`Error saving image: ${filePath}`, error);
            }
        });
    } catch (error) {
        console.error('Error downloading images:', error);
    }
};



const folder = 'imagesFolder6'; // Folder name where the images will be saved
downloadImage(url, config, folder);
