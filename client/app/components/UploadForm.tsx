'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first');

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // This connects to your local Express server
      // Make sure NEXT_PUBLIC_API_URL is set in .env.local
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.url);
        alert('Upload Successful!');
      } else {
        console.error('Server Error:', data);
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white text-black w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Upload Image to R2</h2>
      
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      <button 
        onClick={handleUpload} 
        disabled={uploading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {imageUrl && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2 font-semibold">Uploaded Successfully:</p>
          <div className="border rounded overflow-hidden">
            <img src={imageUrl} alt="Uploaded" className="w-full h-auto object-cover" />
          </div>
          <p className="text-xs text-gray-400 mt-1 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}