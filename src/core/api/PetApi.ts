import { Response } from 'supertest';
import { IApiClient } from '../clients/IApiClient';
import { sanitize } from '../json';
import { Pet } from '../models/Pet';
import { BaseApiHelper } from './BaseApiHelper';

/**
 * Encapsulates all /pet endpoints. Single Responsibility (SOLID).
 */
export class PetApi extends BaseApiHelper {
  /** Resource path for pet endpoints. */
  private static readonly RESOURCE = '/pet';

  /**
   * Creates a new PetApi instance.
   * @param apiClient - API client for making HTTP requests
   */
  constructor(apiClient: IApiClient) {
    super(apiClient);
  }

  /**
   * Adds a new pet to the store.
   * @param pet - The pet to add
   * @returns Promise resolving to the HTTP response
   */
  addPet(pet: Pet): Promise<Response> {
    return this.request('post', PetApi.RESOURCE).send(sanitize(pet));
  }

  /**
   * Updates an existing pet in the store.
   * @param pet - The pet to update
   * @returns Promise resolving to the HTTP response
   */
  updatePet(pet: Pet): Promise<Response> {
    return this.request('put', PetApi.RESOURCE).send(sanitize(pet));
  }

  /**
   * Updates a pet using form data.
   * @param petId - ID of the pet to update
   * @param name - New name for the pet
   * @param status - New status for the pet
   * @returns Promise resolving to the HTTP response
   */
  updateWithForm(petId: number, name: string, status: string): Promise<Response> {
    return this.request('post', `${PetApi.RESOURCE}/${petId}`)
      .type('form')
      .send({ name, status });
  }

  /**
   * Uploads an image for a pet.
   * @param petId - ID of the pet
   * @param file - Image file buffer
   * @param fileName - Name of the image file
   * @param additionalMetadata - Optional metadata to include
   * @returns Promise resolving to the HTTP response
   */
  uploadImage(
    petId: number,
    file: Buffer,
    fileName: string,
    additionalMetadata?: string,
  ): Promise<Response> {
    const request = this.request('post', `${PetApi.RESOURCE}/${petId}/uploadImage`);
    if (additionalMetadata && additionalMetadata.trim() !== '') {
      request.field('additionalMetadata', additionalMetadata);
    }
    return request.attach('file', file, fileName);
  }

  /**
   * Finds pets by status.
   * @param status - Status to filter by
   * @returns Promise resolving to the HTTP response
   */
  getByStatus(status: string): Promise<Response> {
    return this.request('get', `${PetApi.RESOURCE}/findByStatus`).query({ status });
  }

  /**
   * Finds pets by tags.
   * @param tags - Tags to filter by
   * @returns Promise resolving to the HTTP response
   */
  getByTags(...tags: string[]): Promise<Response> {
    const query = tags.map((tag) => `tags=${encodeURIComponent(tag)}`).join('&');
    return this.request('get', `${PetApi.RESOURCE}/findByTags`).query(query);
  }

  /**
   * Gets a pet by its ID.
   * @param petId - ID of the pet to retrieve
   * @returns Promise resolving to the HTTP response
   */
  getById(petId: number): Promise<Response> {
    return this.request('get', `${PetApi.RESOURCE}/${petId}`);
  }

  /**
   * Deletes a pet.
   * @param petId - ID of the pet to delete
   * @returns Promise resolving to the HTTP response
   */
  delete(petId: number): Promise<Response> {
    return this.request('delete', `${PetApi.RESOURCE}/${petId}`);
  }
}
