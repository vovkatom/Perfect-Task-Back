import { v2 as cloudinary } from "cloudinary";

const fetchFromCloudinary = async (tag) => {
  if (tag === "no-background") {
    return {};
  }

  if (tag !== "no-background") {
    try {
      const folderName = `${tag}`;
      console.log("folderName:", folderName);
      const result = await cloudinary.api.resources({
        type: "upload",
        prefix: folderName,
      });
      const sortedImg = result.resources.sort((a, b) => a.width - b.width);
      const setOfImages = {
        min_1x: sortedImg[0].secure_url,
        min_2x: sortedImg[1].secure_url,
        mobile_1x: sortedImg[2].secure_url,
        mobile_2x: sortedImg[3].secure_url,
        tablet_1x: sortedImg[4].secure_url,
        tablet_2x: sortedImg[6].secure_url,
        desktop_1x: sortedImg[5].secure_url,
        desktop_2x: sortedImg[7].secure_url,
      };
      console.log(sortedImg.length);


      return setOfImages;
    } catch (error) {
      console.error(error);
    }
  }
};

export default fetchFromCloudinary;
