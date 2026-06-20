import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
@Injectable()
export class MediaStorageService {
  createUpload(userId: string, mimeType: string, purpose: 'avatar' | 'place' | 'review' | 'post') {
    if (!allowedTypes.has(mimeType)) throw new BadRequestException('Only JPEG, PNG and WebP images are allowed');
    const key = `${purpose}/${userId}/${randomUUID()}`;
    // Production adapter returns an S3 pre-signed PUT URL. Local contract keeps API clients unblocked.
    return { key, uploadUrl: `/api/v1/media/local-upload/${key}`, expiresIn: 900 };
  }
  confirmUpload(userId: string, key: string) { if (!key.includes(`/${userId}/`)) throw new BadRequestException('Upload does not belong to current user'); return { key, confirmed: true }; }
  signedReadUrl(key: string) { return { key, url: `/api/v1/media/${key}`, expiresIn: 900 }; }
}
