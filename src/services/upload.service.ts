
export const uploadRequest = async (file: File | undefined): Promise<string | undefined> => {
  try {
    const formData: FormData = new FormData();
    file && formData.append('file', file);
    formData.append('upload_preset', 'posterPreset');

    const NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    console.log("NEXT_CLOUDINARY_API_URL:", NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);



    const response: Response = await fetch(`${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data && data.secure_url) {
      return data.secure_url;
    } else {
      console.error('Invalid response format from server:', data);
      return undefined;
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return undefined;
  }
};
