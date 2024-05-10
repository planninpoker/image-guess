import {ChangeEvent, useState} from 'react';
import axios from 'axios';

export const ImageUploader = () => {
    const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedImage(event.target.files?.[0]);
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            console.log('No image selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
            const response = await axios.post('/images', formData, {
                timeout: 5000
            });
            console.log('Image uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};