'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultValue?: string;
  label?: string;
}

export function ImageUpload({ onUpload, defaultValue, label }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(defaultValue || null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadId = useId();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/image', formData);

      const url = response.data.url;
      setImage(url);
      onUpload(url);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    onUpload('');
  };

  return (
    <div className="space-y-4 w-full">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="flex items-center gap-4">
        {image ? (
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg group">
            <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center gap-2 text-muted-foreground overflow-hidden">
            <ImageIcon className="h-8 w-8 opacity-50" />
            <span className="text-[10px] font-medium px-2 text-center">No image selected</span>
          </div>
        )}

        <div className="flex-1">
          <div className="relative">
            <input
              type="file"
              id={uploadId}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label htmlFor={uploadId}>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer gap-2 rounded-xl h-11 border-border/50 bg-background/50 backdrop-blur-sm"
                disabled={isUploading}
                asChild
              >
                <span>
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {image ? 'Change Image' : 'Upload Image'}
                </span>
              </Button>
            </label>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 px-1">
            PNG, JPG or WebP. Max size 10MB.
          </p>
        </div>
      </div>
    </div>
  );
}
