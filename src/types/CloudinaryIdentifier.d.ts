export interface CloudinaryIdentifier {
  publicId: string;
  type: "upload" | "authenticated" | "private";
  resourceType: "image" | "raw" | "video" | "auto";
  version: string;
}
