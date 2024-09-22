import { CloudinaryIdentifier } from "@/types/CloudinaryIdentifier";

const cloudinaryUrl = ({ publicId, type, resourceType, version }: CloudinaryIdentifier, transformation?: string) => {
  return (
    "https://res.cloudinary.com/" +
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
    "/" +
    resourceType +
    "/" +
    type +
    "/" +
    (version ? `v${version}` + "/" : "") +
    (transformation ? transformation + "/" : "") +
    publicId
  );
};

const cloudinaryIdentifier = (uploadResponse?: Record<string, any>) => {
  if (!uploadResponse) {
    return { publicId: "", type: "", resourceType: "", version: "" };
  }
  const { public_id, type, resource_type, version } = uploadResponse;
  return { publicId: public_id, type, resourceType: resource_type, version };
};

export { cloudinaryIdentifier, cloudinaryUrl };
