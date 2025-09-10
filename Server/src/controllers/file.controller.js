import { asyncHandler } from "../utils/AsyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/ApiResponse.js";
import { uploadonCloudinary } from "../utils/Cloudinary.js";

const uploadFile = asyncHandler(async (req, res) => {
  const fileLocalPath = req.file?.path;

  if (!fileLocalPath) {
    throw new ApiError(400, "File is missing");
  }

  const uploadedFile = await uploadonCloudinary(fileLocalPath);

  if (!uploadedFile) {
    throw new apiError(500, "Server error while uploading the file.");
  }
  // console.log(uploadedFileresource_type)

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        {
          url: uploadedFile.secure_url,
          fileType: uploadedFile.resource_type,
        },
        "File uploaded successfully"
      )
    );
});

export { uploadFile };
