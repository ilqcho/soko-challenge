import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User, { IUser } from '../models/User';

let mongoServer: MongoMemoryServer;
let mongoUri: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

// Create dummy user
const createTestUser = async (): Promise<IUser> => {
    const userData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
    };
    const user = await User.create(userData);
    return user;
};

// Create user - test
describe('POST /api/users', () => {
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                name: 'John',
                lastName: 'Doe',
                email: `jon.doe${Date.now()}@example.com`,
                phone: '123456789',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe('John');
        expect(response.body.lastName).toBe('Doe');
        expect(response.body).toHaveProperty('email');
        expect(response.body.phone).toBe('123456789');
    });

    it('should handle missing required fields', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                // Missing required fields
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'All fields are required');
    });
});


// Update user - test
describe('PUT /api/user/:id', () => {
    it('should update an existing user', async () => {
      const existingUser = await createTestUser();
      const userIdString = existingUser._id.toString();
  
      const response = await request(app)
        .put(`/api/user/${userIdString}`)
        .send({
          name: 'UpdatedName',
          lastName: 'UpdatedLastName',
          email: 'updated.email@example.com',
        });
  
      expect(response.status).toBe(200);
  
      const updatedUser = await User.findById(existingUser._id);
      expect(updatedUser?.name).toBe('UpdatedName');
      expect(updatedUser?.lastName).toBe('UpdatedLastName');
      expect(updatedUser?.email).toBe('updated.email@example.com');
    });
  
    it('should handle updating a non-existing user', async () => {
      const response = await request(app)
        .put('/api/user/nonexistingid')
        .send({
          name: 'UpdatedName',
        });
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid user ID' });
    });
  
    it('should handle invalid email data', async () => {
      const existingUser = await createTestUser();
  
      const response = await request(app)
        .put(`/api/user/${existingUser._id}`)
        .send({
          email: 'invalid-email',
        });
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid email format' });
    });
});