import { v2 as cloudinary } from "cloudinary";

export async function fetchFromCloudinary(tag) {
  if (tag === "00") {
    return {};
  }

  if (tag !== "00") {
    try {
      const result = await cloudinary.api.resources_by_tag(tag);
      const sortedImg = result.resources.sort((a, b) => a.width - b.width);
      const setOfImages = {
        mobile_1x: sortedImg[0].secure_url,
        mobile_2x: sortedImg[1].secure_url,
        tablet_1x: sortedImg[2].secure_url,
        tablet_2x: sortedImg[4].secure_url,
        desktop_1x: sortedImg[3].secure_url,
        desktop_2x: sortedImg[5].secure_url,
      };
      return setOfImages;
    } catch (error) {
      console.error(error);
    }
  }
}

export async function fetchFromCloudinaryBgAllmin(tag) {
  try {
    const result = await cloudinary.api.resources_by_tag(tag, {
      max_results: 500,
      direction: "asc",
    });
    const resources = result.resources;


    const sortable = resources.map((item, index) => {
      const filenameWithExtension = item.secure_url.substring(item.secure_url.lastIndexOf('/') + 1);

      const filenameWithoutExtension = filenameWithExtension.split('.').slice(0, -1).join('.');
      return [filenameWithoutExtension, item.secure_url];
    });

    sortable.sort(([filename1], [filename2]) => {
      return filename1.localeCompare(filename2);
    });


    const sortedUrls = Object.fromEntries(sortable);

    return sortedUrls;
  } catch (error) {
    console.error(error);
  }
}




export default { fetchFromCloudinary, fetchFromCloudinaryBgAllmin };
