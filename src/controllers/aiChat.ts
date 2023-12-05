import {Response, Request, NextFunction, json} from "express";
import dotenv from "dotenv";
import axios from 'axios';
import sharp from 'sharp';
import fs from'fs';
import crypto from "crypto";
import imageSize from "image-size";
import path from "path";

const ENV = dotenv.config();
const AI_CHAT = ENV.parsed!.AI_CHAT.toString();
const AI_KEY = ENV.parsed!.AI_KEY.toString();

export const aiChat = async (
  req: Request,
  res: Response,
): Promise<void> => {

  let generationResponse;
    try {
      const { words } = req.body;

      generationResponse = await axios.post(
        AI_CHAT,
        {
          "model": "dall-e-3",
            "prompt": words,
            "n": 1,
            "size": "1024x1024",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AI_KEY} `,
          },
        }
      );

      // Check if the generation request was successful (status code 200)
      if (generationResponse && generationResponse.status === 200) {

        // Extract the URL of the generated image
        const imageUrl = generationResponse.data.data[0]?.url;

        if (imageUrl) {

          // Download the image from the URL
          const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

          // Use the sharp library to process the downloaded image data (resize)
          const processedImageBuffer = await sharp(imageResponse.data)
            .resize(300) // Adjust the size as needed
            .toBuffer();

          // Fn for generation different data for name
          const date = new Date().getDate() === 31 ? 30 : new Date().getDate();
          const month = new Date().getMonth() + 1;
          const day = `${month}${date}`;

          // Create name for file from generation fn up
          const newFilename = `${crypto.randomUUID()}-a99a-${day}.jpg`;

          // Save the processed image to disk
          fs.writeFileSync(`src/public/uploads/${newFilename}`, processedImageBuffer);

          // Save way in constant
          const filePath = path.resolve(`src/public/uploads/${newFilename}`);

          // Created way for frontend app
          const fileUrl = `/uploads/${newFilename}`;

          const size = await imageSize(filePath);

          // Send response witch body to frontent app
          res.send({
            message: "upload successful",
            url: fileUrl,
            name: newFilename,
            width: size.width,
            height: size.height,
          });

        } else {
          console.error('Error: Image URL is undefined');
          res.status(500).send('Internal Server Error');
        }

        // res.send('Generated image saved successfully!');
      } else if (generationResponse?.status === 429) {

        // Handle rate limit error
        console.error('Error: Rate limit exceeded. Retrying after waiting...');
        // Implement a wait and retry logic, for example:
        // await wait(5000); // Wait for 5 seconds (adjust as needed)
        // Retry the request
        res.status(429).send('Rate limit exceeded. Please try again later.');
        // return aiChat(req, res);
        return;

      } else {
        console.error(`Error: ${generationResponse?.status}`);
        console.error('error', generationResponse?.data);
        res.status(generationResponse?.status || 500).send('Error occurred during image generation');
      }
    } catch (error: any) {
      console.error('block error Response:', generationResponse?.status, error?.code);
      res.status(500).send('Internal Server Error');
    }
};

// Utility function to wait for a specified duration
// const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
