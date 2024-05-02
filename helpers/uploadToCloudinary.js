import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinary = async (req) => {
    const avatarURL = req.file.path;
    const { _id } = req.user;
    const public_id = `user_avatar-${_id}`;

    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        public_id,
        folder: "avatars",
        transformation: [{ width: 200, height: 200, gravity: "auto", crop: "fill" }],
    };

    try {
        const result = await cloudinary.uploader.upload(avatarURL, options);

        return result.secure_url;
    } catch (error) {
        console.error(error);
    }
};

export default uploadToCloudinary;