require('dotenv').config();
let express = require('express');
let app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
let sharp = require('sharp');
const axios = require('axios');


app.get('/resize-image', async (req, res, next) => {

    try {

        const {quality, width, imageUrl} = req.query;
        const qualityParsed = parseInt(quality);
        const widthParsed = parseInt(width);
        const response = await axios.get(imageUrl, {responseType: 'arraybuffer'});
        const imageData = response.data;
        const resizedImage = await sharp(imageData).toBuffer();
        const image = await sharp(resizedImage);
        if (!isNaN(qualityParsed)) {
            image.jpeg({quality: qualityParsed});
        }

        if (!isNaN(widthParsed)) {
            image.resize({width: widthParsed});
        }

        res.setHeader('Content-Type', 'image/jpeg');
        image.pipe(res);
    } catch (error) {
        console.error('Error resizing the image:', error);
        res.send();
    }

})

app.get("/api", (req, res) => {
    const {name} = req.body;
    res.json(`Hello there ${name}!`);
});

let port = process.env.PORT;

app.listen(port, () => {
    console.log(`server is running http://localhost:${port}`);
});


