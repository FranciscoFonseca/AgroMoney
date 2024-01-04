export type minMax = {
	min: number;
	max: number;
};

export const getMimeType = (fileExtension: string): string | undefined => {
	const mimeTypes: Record<string, string> = {
		pdf: 'application/pdf',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		// Add more extensions and MIME types as needed
	};

	return mimeTypes[fileExtension.toLowerCase()];
};