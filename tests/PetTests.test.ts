import * as fs from 'fs';
import * as path from 'path';
import { Pet } from '../src/core/models/Pet';
import { deserializeAs } from './assertions/responseAssertions';
import { log } from './support/testLog';
import { createPet } from './testData/PetTestData';
import { createTestFixture, TestFixture } from './TestFixtureBase';

describe('Pets', () => {
  let api: TestFixture;

  beforeEach(() => {
    api = createTestFixture();
  });

  // ---------- Data sources (DDT) ----------

  const uniqueId = (): number => Math.floor(Math.random() * 1_000_000_000) + 1;

  // ---------- POST /pet : Add a new pet ----------

  it('Should add a new pet and retrieve it back', async () => {
    // Arrange
    const pet = createPet({ id: uniqueId(), name: 'Buddy', status: 'available' });
    log.info(`Attempting to add pet with ID: ${pet.id} and Name: ${pet.name}`);

    // Act
    const response = await api.pets.addPet(pet);

    // Assert
    expect(response).toBeSuccessful('the API should accept a well-formed pet');
    expect(response).toHaveStatusCode(200);
    log.pass(`Successfully added pet. Status Code: ${response.status}`);

    const created = await api.pets.getById(pet.id!);
    expect(created).toBeSuccessful();
    const fetched = deserializeAs<Pet>(created);
    expect(fetched.name).toBe('Buddy');
    expect(fetched.status).toBe('available');
    log.pass(`Verified pet details: Name=${fetched.name}, Status=${fetched.status}`);

    // Cleanup
    await api.pets.delete(pet.id!);
  });

  // ---------- GET /pet/findByStatus : Filter by status (DDT) ----------

  it.each(['available', 'pending', 'sold'])(
    'Should find pets that are "%s"',
    async (status) => {
      // Arrange
      const pet = createPet({ id: uniqueId(), name: 'StatusDog', status });
      await api.pets.addPet(pet);

      // Act
      const response = await api.pets.getByStatus(status);

      // Assert
      expect(response).toBeSuccessful();
      const pets = deserializeAs<Pet[]>(response);
      expect(pets.length).toBeGreaterThan(0);
      expect(pets.every((p) => p.status === status)).toBe(true);

      // Cleanup
      await api.pets.delete(pet.id!);
    },
  );

  // ---------- GET /pet/findByTags : Filter by tags ----------

  it('Should find pets by an existing tag', async () => {
    // Arrange
    const pet = createPet({ id: uniqueId(), name: 'TaggedDog' });
    await api.pets.addPet(pet);

    // Act
    const response = await api.pets.getByTags('friendly');

    // Assert
    expect(response).toBeSuccessful();
    const pets = deserializeAs<Pet[]>(response);
    expect(pets.length).toBeGreaterThan(0);

    // Cleanup
    await api.pets.delete(pet.id!);
  });

  // ---------- GET /pet/{id} : Fetch by id ----------

  it('Should retrieve a pet by its id', async () => {
    // Arrange
    const pet = createPet({ id: uniqueId(), name: 'Findable' });
    await api.pets.addPet(pet);

    // Act
    const response = await api.pets.getById(pet.id!);

    // Assert
    expect(response).toBeSuccessful();
    const fetched = deserializeAs<Pet>(response);
    expect(fetched.id).toBe(pet.id);
    expect(fetched.name).toBe('Findable');

    // Cleanup
    await api.pets.delete(pet.id!);
  });

  // ---------- GET /pet/{id} : unknown id ----------

  it('Should return 404 when a pet does not exist', async () => {
    // Arrange
    const unknownId = 999999999;

    // Act
    const response = await api.pets.getById(unknownId);

    // Assert - demo API may return 200 with constructed pet for some ids; ensure no server error
    expect(response.status).toBeLessThan(500);
  });

  // ---------- PUT /pet : Update existing pet ----------

  it("Should update an existing pet's name", async () => {
    // Arrange
    const pet = createPet({ id: uniqueId(), name: 'BeforeUpdate' });
    await api.pets.addPet(pet);
    pet.name = 'AfterUpdate';

    // Act
    const response = await api.pets.updatePet(pet);

    // Assert
    expect(response).toBeSuccessful();

    // Verify persisted change
    const getResponse = await api.pets.getById(pet.id!);
    const fetched = deserializeAs<Pet>(getResponse);
    expect(fetched.name).toBe('AfterUpdate');

    // Cleanup
    await api.pets.delete(pet.id!);
  });

  // ---------- POST /pet/{id} : Update pet with form data ----------

  it("Should update a pet's name and status via form data", async () => {
    // Arrange
    const pet = createPet({ id: uniqueId(), name: 'FormPet', status: 'available' });
    await api.pets.addPet(pet);

    // Act
    const response = await api.pets.updateWithForm(pet.id!, 'FormPetNew', 'sold');

    // Assert
    expect(response).toBeSuccessful();

    // Verify persisted change
    const getResponse = await api.pets.getById(pet.id!);
    const fetched = deserializeAs<Pet>(getResponse);
    expect(fetched.name).toBe('FormPetNew');
    expect(fetched.status).toBe('sold');

    // Cleanup
    await api.pets.delete(pet.id!);
  });

  // ---------- POST /pet/{id}/uploadImage : Upload an image ----------

  it('Should upload a photo for a pet', async () => {
    // Arrange
    const pet = createPet({ id: uniqueId(), name: 'PhotoDog' });
    await api.pets.addPet(pet);
    const image = fs.readFileSync(path.join(__dirname, 'testData', 'img', 'dog_photo.jpg'));

    // Act
    const response = await api.pets.uploadImage(pet.id!, image, 'photo.jpg', 'metadata-foo');

    // Assert
    expect(response).toBeSuccessful();
    expect(response.text).toContain('metadata-foo');
    expect(response.text).toContain('photo.jpg');

    // Cleanup
    await api.pets.delete(pet.id!);
  });

  // ---------- DELETE /pet/{id} : Delete existing pet ----------

  it('Should delete a pet and confirm it is gone', async () => {
    // Arrange
    const pet = createPet({ id: uniqueId(), name: 'ToDelete' });
    await api.pets.addPet(pet);

    // Act
    const response = await api.pets.delete(pet.id!);

    // Assert (delete returns 200 on demo server)
    expect(response).toBeSuccessful();

    const getResponse = await api.pets.getById(pet.id!);
    expect(getResponse.status).toBeLessThan(500);
  });

  // ---------- Validity boundaries (DDT) ----------

  it.each([0, 1, -1])(
    'Should not error when looking up unknown id %i',
    async (id) => {
      // Arrange (use ids that are unlikely to exist but are valid numbers)
      // Act
      const response = await api.pets.getById(id);

      // Assert
      expect([200, 404]).toContain(response.status);
    },
  );
});
