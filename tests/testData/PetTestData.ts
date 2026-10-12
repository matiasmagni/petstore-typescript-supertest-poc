import { Order } from '../../src/core/models/Order';
import { Pet } from '../../src/core/models/Pet';
import { User } from '../../src/core/models/User';

/**
 * Factory that produces test data. Keeps the tests focused on assertions (Arrange).
 */

export interface CreatePetOptions {
  id?: number;
  name?: string;
  status?: string;
  categoryId?: number;
  categoryName?: string;
  photoUrls?: string[];
}

export function createPet(options: CreatePetOptions = {}): Pet {
  const {
    id = 0,
    name = 'Rex',
    status = 'available',
    categoryId = 1,
    categoryName = 'Dogs',
    photoUrls,
  } = options;

  return {
    id,
    name,
    status,
    category: { id: categoryId, name: categoryName },
    photoUrls:
      photoUrls && photoUrls.length > 0
        ? photoUrls
        : ['https://example.com/rex.jpg'],
    tags: [{ id: 1, name: 'friendly' }],
  };
}

export interface CreateUserOptions {
  id?: number;
  username?: string;
  password?: string;
}

export function createUser(options: CreateUserOptions = {}): User {
  const { id = 10, username = 'john_doe', password = 'secret123' } = options;

  return {
    id,
    username,
    firstName: 'John',
    lastName: 'Doe',
    email: `${username}@example.com`,
    password,
    phone: '555-0100',
    userStatus: 1,
  };
}

export interface CreateOrderOptions {
  id?: number;
  petId?: number;
  quantity?: number;
  status?: string;
}

export function createOrder(options: CreateOrderOptions = {}): Order {
  const { id = 0, petId = 0, quantity = 1, status = 'placed' } = options;

  return {
    id,
    petId,
    quantity,
    shipDate: new Date().toISOString(),
    status,
    complete: false,
  };
}
