"use client";

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    const imgElement = e.currentTarget.querySelector('img');
    if (imgElement) {
      imgElement.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const imgElement = e.currentTarget.querySelector('img');
    if (imgElement) {
      imgElement.style.transformOrigin = 'center center';
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden pb-2 md:pb-0">
        {images.map((image, index) => (
          <Card
            key={index}
            className={cn(
              "w-20 h-20 flex-shrink-0 cursor-pointer overflow-hidden",
              selectedImage === image && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </Card>
        ))}
      </div>
      <Card 
        className="flex-1 aspect-square overflow-hidden relative group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={selectedImage}
          alt={productName}
          width={600}
          height={600}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[2]"
          priority
        />
      </Card>
    </div>
  );
}
