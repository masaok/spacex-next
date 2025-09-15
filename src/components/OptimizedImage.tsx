import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAhEQACAQIEBwAAAAAAAAAAAAABAgADBAUREiExQVFhkf/aAAwDAQACEQMRAD8A0XiIuLiVmZ3YgKoySTyBVf8AOprLRdUs9HvRbO4uI/uE0IZxtJJABCkZwRnPPNchKKhL8bGt+ZccaQVB5Y5iqhWUjkjFcnXXSLJ+9CJJ6GNQg2hsHhkAo24KpE3w4bq/wB9nGpCjA==';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          priority={priority}
          sizes={sizes}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? (blurDataURL || defaultBlurDataURL) : undefined}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        <div className="flex items-center justify-center bg-gray-800 text-gray-400 min-h-[100px]">
          <span>Image unavailable</span>
        </div>
      )}

      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}
    </div>
  );
}

// Specialized components for different image types
export function LaunchPatchImage({
  src,
  launchName,
  className = "w-16 h-16 object-contain"
}: {
  src: string;
  launchName: string;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={`Mission patch for ${launchName} SpaceX launch - Official mission insignia`}
      width={64}
      height={64}
      className={className}
      quality={90}
      priority={false}
    />
  );
}

export function VehicleImage({
  src,
  vehicleName,
  imageIndex,
  className = "w-full h-full object-cover hover:scale-105 transition-transform duration-300"
}: {
  src: string;
  vehicleName: string;
  imageIndex: number;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={`High-quality photograph of ${vehicleName} SpaceX rocket - Image ${imageIndex + 1} showing detailed view of the spacecraft`}
      width={400}
      height={225}
      className={className}
      quality={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
    />
  );
}