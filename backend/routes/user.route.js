import express from 'express';
import { getUser, deleteUser, test } from '../controllers/user.controller.js';
import { updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Route for testing purposes
router.get('/test', test);

// Route to delete a user by ID, requires user authentication
router.delete('/delete/:id', verifyToken, deleteUser);

// Route to update a user's profile (e.g., monthlyGoal)
router.put('/update/:id', verifyToken, updateUser);

// Route to get details of a specific user by ID, requires user authentication
router.get('/:id', verifyToken, getUser);

export default router; // Exporting the router for use in the main server file
