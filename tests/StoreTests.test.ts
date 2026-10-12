import { Order } from '../src/core/models/Order';
import { deserializeAs } from './assertions/responseAssertions';
import { log } from './support/testLog';
import { createOrder } from './testData/PetTestData';
import { createTestFixture, TestFixture } from './TestFixtureBase';

describe('Store orders', () => {
  let api: TestFixture;

  beforeEach(() => {
    api = createTestFixture();
  });

  const uniqueId = (): number => Math.floor(Math.random() * 1_000_000_000) + 1;

  // ---------- GET /store/inventory ----------

  it('Should return the store inventory per status', async () => {
    // Act
    const response = await api.store.getInventory();

    // Assert
    expect(response).toBeSuccessful();
    const inventory = deserializeAs<Record<string, number>>(response);
    expect(inventory).toHaveProperty('available');
    expect(inventory).toHaveProperty('pending');
    expect(inventory).toHaveProperty('sold');
  });

  // ---------- POST /store/order ----------

  it('Should place an order and echo back its id', async () => {
    // Arrange
    const order = createOrder({ id: uniqueId(), petId: uniqueId() });
    log.info(`Placing order with ID: ${order.id} for Pet ID: ${order.petId}`);

    // Act
    const response = await api.store.placeOrder(order);

    // Assert
    expect(response).toBeSuccessful();
    const created = deserializeAs<Order>(response);
    expect(created.id).toBe(order.id);
    expect(created.status).toBe('placed');
    log.pass(`Successfully placed order. Status: ${created.status}`);

    // Cleanup
    await api.store.deleteOrder(order.id!);
  });

  // ---------- GET /store/order/{id} ----------

  it('Should retrieve a placed order by id', async () => {
    // Arrange
    const order = createOrder({ id: uniqueId(), petId: uniqueId() });
    await api.store.placeOrder(order);

    // Act
    const response = await api.store.getOrderById(order.id!);

    // Assert
    expect(response).toBeSuccessful();
    const fetched = deserializeAs<Order>(response);
    expect(fetched.id).toBe(order.id);
    expect(fetched.status).toBe('placed');

    // Cleanup
    await api.store.deleteOrder(order.id!);
  });

  // ---------- GET /store/order/{id} : 404 ----------

  it('Should return 404 when an order does not exist', async () => {
    // Arrange
    const unknownId = 99999999999;

    // Act
    const response = await api.store.getOrderById(unknownId);

    // Assert
    expect(response).toHaveStatusCode(404);
  });

  // ---------- DELETE /store/order/{id} ----------

  it('Should delete an order and confirm it is gone', async () => {
    // Arrange
    const order = createOrder({ id: uniqueId(), petId: uniqueId() });
    await api.store.placeOrder(order);

    // Act
    const response = await api.store.deleteOrder(order.id!);

    // Assert
    expect(response).toBeSuccessful();

    // Verify deletion
    const getResponse = await api.store.getOrderById(order.id!);
    expect(getResponse).toHaveStatusCode(404);
  });
});
