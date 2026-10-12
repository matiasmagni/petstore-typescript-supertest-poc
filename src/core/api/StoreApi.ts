import { Response } from 'supertest';
import { IApiClient } from '../clients/IApiClient';
import { sanitize } from '../json';
import { Order } from '../models/Order';
import { BaseApiHelper } from './BaseApiHelper';

/**
 * Encapsulates all /store endpoints. Single Responsibility (SOLID).
 */
export class StoreApi extends BaseApiHelper {
  /** Resource path for store endpoints. */
  private static readonly RESOURCE = '/store';

  /**
   * Creates a new StoreApi instance.
   * @param apiClient - API client for making HTTP requests
   */
  constructor(apiClient: IApiClient) {
    super(apiClient);
  }

  /**
   * Returns pet inventories by status.
   * @returns Promise resolving to the HTTP response
   */
  getInventory(): Promise<Response> {
    return this.request('get', `${StoreApi.RESOURCE}/inventory`);
  }

  /**
   * Places an order for a pet.
   * @param order - The order to place
   * @returns Promise resolving to the HTTP response
   */
  placeOrder(order: Order): Promise<Response> {
    return this.request('post', `${StoreApi.RESOURCE}/order`).send(sanitize(order));
  }

  /**
   * Finds a purchase order by ID.
   * @param orderId - ID of the order to retrieve
   * @returns Promise resolving to the HTTP response
   */
  getOrderById(orderId: number): Promise<Response> {
    return this.request('get', `${StoreApi.RESOURCE}/order/${orderId}`);
  }

  /**
   * Deletes a purchase order by ID.
   * @param orderId - ID of the order to delete
   * @returns Promise resolving to the HTTP response
   */
  deleteOrder(orderId: number): Promise<Response> {
    return this.request('delete', `${StoreApi.RESOURCE}/order/${orderId}`);
  }
}
