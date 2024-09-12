import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config"


cloudinary.config({
    cloud_name: process.env.CLOUD...,
    api_key: process.env.966768427936784 ,
    api_secret: process.env.yRu2TC3_mZfQV12s4kl5kDN8fDY
})

module.exports=cloudinary;