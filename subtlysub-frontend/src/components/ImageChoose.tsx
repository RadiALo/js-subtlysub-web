import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageChooseProps {
  onUpload: (filePath: string) => void;
  imageUrl: string;
  uploaded: boolean;
}

const ImageChoose: React.FC<ImageChooseProps> = (props) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [imageUrl, setImageUrl] = useState<string>(props.imageUrl ? props.imageUrl : "");
  const [uploaded, setUploaded] = useState<boolean>(props.uploaded ? props.uploaded : false);
  
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 50,
    x: 0,
    y: 25
  });

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setUploaded(props.uploaded ? props.uploaded : uploaded);
    setImageUrl(props.imageUrl ? props.imageUrl : imageUrl);
  }, [props]);

  const uploadImage = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getCroppedImage = (): Blob | null => {
    if (!image || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width ? crop.width * scaleX : 0;
    canvas.height = crop.height ? crop.height * scaleY : 0;

    ctx.drawImage(
      image,
      (crop.x ?? 0) * scaleX,
      (crop.y ?? 0) * scaleY,
      (crop.width ?? 0) * scaleX,
      (crop.height ?? 0) * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg");
    });
  };

  const handleUploadCroppedImage = async () => {
    const croppedBlob = await getCroppedImage();
    if (!croppedBlob) return;

    const formData = new FormData();
    formData.append("image", croppedBlob, "cropped.jpg");

    try {
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setUploaded(true);
      setImageUrl(data.filePath);
      props.onUpload(data.filePath);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRenew = async () => {
    setImage(null);
    setUploaded(false);
    setImageUrl("");
  }

  return (
    <div>
      {uploaded ? (
        <>
          <div>
            <img src={`${apiUrl}${imageUrl}`} alt="Collection icon" className="rounded w-full max-h-32 object-cover object-center" />
          </div>

          <button
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            onClick={handleRenew}
          >Load new</button>
        </>
      ) : (
        <>
          <input 
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
            className="file:bg-purple-500 file:text-white file:px-4 file:py-2 file:rounded-md file:hover:bg-purple-600 file:cursor-pointer file:mr-4"
          />

          {imageUrl && (
            <div className="mt-4">
              <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                <img
                  src={imageUrl}
                  ref={(img) => setImage(img)}
                  alt="Crop preview"
                  className="max-h-64"
                />
              </ReactCrop>
              <button
                onClick={handleUploadCroppedImage}
                className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Upload Cropped Image
              </button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
};

export default ImageChoose;
