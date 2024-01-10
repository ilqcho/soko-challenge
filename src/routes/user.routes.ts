import { Router } from 'express';
import { getAllUsers, getUserById, createUser, deleteUser, updateUser } from '../controllers/user.controller';
import { handleValidationError, handleMissingFields, handleInvalidEmailFormat, handleDatabaseError } from '../middlewares/error.middleware';

const router = Router();

router.get('/users', getAllUsers);

router.get('/user/:id', handleValidationError, getUserById);

router.post('/users', handleMissingFields, handleInvalidEmailFormat, createUser);

router.delete('/user/:id', handleValidationError, deleteUser);

router.put('/user/:id', handleValidationError, handleInvalidEmailFormat, updateUser);

router.use(handleDatabaseError);

export default router;