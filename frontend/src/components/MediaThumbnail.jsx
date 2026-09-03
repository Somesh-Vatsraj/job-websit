// frontend/src/components/MediaThumbnail.jsx
import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function MediaThumbnail({
    src,
    alt = '',
    className = '',
    aspectRatio = '16/9',
    fallbackIcon = ImageIcon,
}) {
    const [error, setError] = useState(false);
    const FallbackIcon = fallbackIcon;

    if (!src || error) {
        return (
            <div
                className={`w-full bg-primary-light/30 dark:bg-[#2a1a4a]/30 flex items-center justify-center overflow-hidden ${className}`}
                style={{ aspectRatio }}
            >
                <FallbackIcon className="w-10 h-10 text-primary/40" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={`w-full object-cover object-center ${className}`}
            style={{ aspectRatio }}
            onError={() => setError(true)}
            loading="lazy"
        />
    );
}