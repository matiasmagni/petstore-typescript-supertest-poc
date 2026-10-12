import { Response } from 'supertest';
import { IApiClient } from '../clients/IApiClient';
import { sanitize } from '../json';
import { User } from '../models/User';
import { BaseApiHelper } from './BaseApiHelper';

/**
 * Encapsulates all /user endpoints. Single Responsibility (SOLID).
 */
export class UserApi extends BaseApiHelper {
  /** Resource path for user endpoints. */
  private static readonly RESOURCE = '/user';

  /**
   * Creates a new UserApi instance.
   * @param apiClient - API client for making HTTP requests
   */
  constructor(apiClient: IApiClient) {
    super(apiClient);
  }

  /**
   * Creates a new user.
   * @param user - The user to create
   * @returns Promise resolving to the HTTP response
   */
  create(user: User): Promise<Response> {
    return this.request('post', UserApi.RESOURCE).send(sanitize(user));
  }

  /**
   * Creates a list of users with a single request.
   * @param users - Array of users to create
   * @returns Promise resolving to the HTTP response
   */
  createWithList(users: User[]): Promise<Response> {
    return this.request('post', `${UserApi.RESOURCE}/createWithList`).send(sanitize(users));
  }

  /**
   * Creates an array of users with a single request.
   * @param users - Array of users to create
   * @returns Promise resolving to the HTTP response
   */
  createWithArray(users: User[]): Promise<Response> {
    return this.request('post', `${UserApi.RESOURCE}/createWithArray`).send(sanitize(users));
  }

  /**
   * Logs user into the system.
   * @param username - The username for login
   * @param password - The password for login
   * @returns Promise resolving to the HTTP response
   */
  login(username: string, password: string): Promise<Response> {
    return this.request('get', `${UserApi.RESOURCE}/login`).query({ username, password });
  }

  /**
   * Logs out current logged in user session.
   * @returns Promise resolving to the HTTP response
   */
  logout(): Promise<Response> {
    return this.request('get', `${UserApi.RESOURCE}/logout`);
  }

  /**
   * Gets a user by username.
   * @param username - The username to retrieve
   * @returns Promise resolving to the HTTP response
   */
  getByUsername(username: string): Promise<Response> {
    return this.request('get', `${UserApi.RESOURCE}/${username}`);
  }

  /**
   * Updates a user.
   * @param username - The username to update
   * @param user - Updated user data
   * @returns Promise resolving to the HTTP response
   */
  update(username: string, user: User): Promise<Response> {
    return this.request('put', `${UserApi.RESOURCE}/${username}`).send(sanitize(user));
  }

  /**
   * Deletes a user.
   * @param username - The username to delete
   * @returns Promise resolving to the HTTP response
   */
  delete(username: string): Promise<Response> {
    return this.request('delete', `${UserApi.RESOURCE}/${username}`);
  }
}
