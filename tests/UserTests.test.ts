import { User } from '../src/core/models/User';
import { deserializeAs } from './assertions/responseAssertions';
import { log } from './support/testLog';
import { createUser } from './testData/PetTestData';
import { createTestFixture, TestFixture } from './TestFixtureBase';

describe('Users', () => {
  let api: TestFixture;

  beforeEach(() => {
    api = createTestFixture();
  });

  const uniqueUsername = (): string =>
    `u_${Math.random().toString(36).slice(2, 14)}`;

  // ---------- POST /user : create user ----------

  it('Should create a new user', async () => {
    // Arrange
    const username = uniqueUsername();
    const user = createUser({ id: 7777 + Math.floor(Math.random() * 1000), username });
    log.info(`Creating user with username: ${username}`);

    // Act
    const response = await api.users.create(user);

    // Assert
    expect(response).toBeSuccessful();
    log.pass(`Successfully created user. Status Code: ${response.status}`);

    // Cleanup
    await api.users.delete(username);
  });

  // ---------- GET /user/{username} : fetch by username ----------

  it('Should retrieve a user by username', async () => {
    // Arrange
    const username = uniqueUsername();
    const user = createUser({ id: 8888 + Math.floor(Math.random() * 1000), username });
    await api.users.create(user);

    // Act
    const response = await api.users.getByUsername(username);

    // Assert
    expect(response).toBeSuccessful();
    const fetched = deserializeAs<User>(response);
    expect(fetched.username).toBe(username);
    expect(fetched.firstName).toBe('John');

    // Cleanup
    await api.users.delete(username);
  });

  // ---------- GET /user/{username} : 404 for unknown ----------

  it('Should return 404 when a user does not exist', async () => {
    // Arrange
    const unknownUsername = 'no_such_user_42';

    // Act
    const response = await api.users.getByUsername(unknownUsername);

    // Assert
    expect(response).toHaveStatusCode(404);
  });

  // ---------- PUT /user/{username} : update user ----------

  it("Should update an existing user's first name", async () => {
    // Arrange
    const username = uniqueUsername();
    const user = createUser({ id: 6666 + Math.floor(Math.random() * 1000), username });
    await api.users.create(user);
    user.firstName = 'Jane';

    // Act
    const response = await api.users.update(username, user);

    // Assert
    expect(response).toBeSuccessful();

    // Verify persistence
    const getResponse = await api.users.getByUsername(username);
    const updated = deserializeAs<User>(getResponse);
    expect(updated.firstName).toBe('Jane');

    // Cleanup
    await api.users.delete(username);
  });

  // ---------- DELETE /user/{username} ----------

  it('Should delete a user and confirm they are gone', async () => {
    // Arrange
    const username = uniqueUsername();
    const user = createUser({ id: 5555 + Math.floor(Math.random() * 1000), username });
    await api.users.create(user);

    // Act
    const response = await api.users.delete(username);

    // Assert
    expect(response).toBeSuccessful();

    // Verify deletion
    const getResponse = await api.users.getByUsername(username);
    expect(getResponse).toHaveStatusCode(404);
  });

  // ---------- GET /user/login, GET /user/logout ----------

  it('Should log a user in and then out', async () => {
    // Arrange
    const username = uniqueUsername();
    const user = createUser({ id: 4444 + Math.floor(Math.random() * 1000), username });
    await api.users.create(user);

    // Act
    const login = await api.users.login(username, user.password!);
    const logout = await api.users.logout();

    // Assert
    expect(login).toBeSuccessful();
    expect(login.text).toContain('logged in');
    expect(logout).toBeSuccessful();

    // Cleanup
    await api.users.delete(username);
  });

  // ---------- POST /user/createWithArray ----------

  it('Should create several users at once from an array', async () => {
    // Arrange
    const users: User[] = [
      createUser({ id: 1212, username: uniqueUsername() }),
      createUser({ id: 1313, username: uniqueUsername() }),
    ];

    // Act
    const response = await api.users.createWithArray(users);

    // Assert
    expect(response).toBeSuccessful();

    // Verify one of the created users is queryable
    const getResponse = await api.users.getByUsername(users[0].username);
    expect(getResponse).toBeSuccessful();

    // Cleanup
    for (const user of users) {
      await api.users.delete(user.username);
    }
  });

  // ---------- POST /user/createWithList ----------

  it('Should create several users at once from a list', async () => {
    // Arrange
    const users: User[] = [
      createUser({ id: 1111, username: uniqueUsername() }),
      createUser({ id: 2222, username: uniqueUsername() }),
      createUser({ id: 3333, username: uniqueUsername() }),
    ];

    // Act
    const response = await api.users.createWithList(users);

    // Assert
    expect(response).toBeSuccessful();

    // Cleanup
    for (const user of users) {
      await api.users.delete(user.username);
    }
  });
});
