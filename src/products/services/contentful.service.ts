import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntryCollection, EntrySkeletonType, createClient } from 'contentful';

@Injectable()
export class ContentfulService {
  private client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
  });

  async getProducts(): Promise<EntryCollection<EntrySkeletonType, undefined, string>> {
    try {
      const response = await this.client.getEntries({
        content_type: process.env.CONTENTFUL_CONTENT_TYPE || 'product',
      });
      return response;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to fetch products',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
