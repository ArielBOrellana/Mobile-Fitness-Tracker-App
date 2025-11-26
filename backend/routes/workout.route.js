import express from 'express';
import { createWorkout, getWorkouts, getWorkoutById, updateWorkout, deleteWorkout } from '../controllers/workout.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Route to create a new workout, requires user authentication
router.post('/create', verifyToken, createWorkout);

// Route to get all workouts for the authenticated user
router.get('/', verifyToken, getWorkouts);

// Route to get a specific workout by ID, requires user authentication
router.get('/:id', verifyToken, getWorkoutById);

// Route to update a specific workout by ID, requires user authentication
router.put('/update/:id', verifyToken, updateWorkout);

// Route to delete a specific workout by ID, requires user authentication
router.delete('/delete/:id', verifyToken, deleteWorkout);

export default router; // Exporting the router for use in the main server file