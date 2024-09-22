import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file: File | string, options?: { folder: string; backup?: boolean; publicId?: string }) => {
  const uploadOptions = {
    upload_preset: process.env.NEXT_PUBLIC_UPLOAD_PRESET,
    folder: options?.publicId ? undefined : options?.folder,
    invalidate: true,
    use_filename: true,
    backup: options?.backup || true,
    public_id: options?.publicId,
  };

  let uploadResult;

  if (typeof file === "string") {
    uploadResult = await cloudinary.uploader.upload(file, uploadOptions);
  } else {
    const buffer = Buffer.from(await file.arrayBuffer());

    uploadResult = await new Promise<any>((resolve) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(buffer);
    });
  }

  return uploadResult;
};

const deleteImage = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId, { invalidate: true });
};

const bulkDeleteImages = async (publicIds: string[]) => {
  await cloudinary.api.delete_resources(publicIds, { invalidate: true });
};

const restoreImages = async (publicIds: string[]) => {
  await cloudinary.api.restore(publicIds);
};

export { bulkDeleteImages, deleteImage, restoreImages, uploadImage };
