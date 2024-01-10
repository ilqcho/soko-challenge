import { Router } from 'express';
import { getAllUsers, getUserById, createUser, deleteUser, updateUser } from '../controllers/user.controller';

const router = Router();

router.route('/users')
    .get(getAllUsers)
    .post(createUser);

router.route('/user/:id')
    .get(getUserById)
    .delete(deleteUser)
    .put(updateUser);

export default router;