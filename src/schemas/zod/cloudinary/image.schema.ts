import { z } from "zod";

const imageSchema = z.object({
	publicId: z.string(),
	type: z.string(),
	resourceType: z.string(),
	version: z.string(),
});

type ImageSchema = z.infer<typeof imageSchema>;

export { imageSchema, type ImageSchema };
