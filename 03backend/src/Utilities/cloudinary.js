import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true
});

// Log the configuration
console.log(cloudinary.config());

const uploadOnCloudnary = async (localFilePath) => {
    try{
        if (!localFilePath) return null
        //file upload
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        }); 
        //file upload complete
        // console.log("[*]-- file upload is sucessfull ",res);
        fs.unlinkSync(localFilePath)
        return res
    }catch(error){
        fs.unlinkSync(localFilePath) //remove the file from local storage as file upload was failed
        return null
    }
}


export {uploadOnCloudnary}