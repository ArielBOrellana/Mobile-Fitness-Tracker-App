import Workout from "../models/workout.model.js";
import { errorHandler } from "../utils/error.js";

// Helper: Build dynamic query from request params
const buildWorkoutQuery = (req, userId) => {
  const { q, type, intensity, minDuration, maxDuration, startDate, endDate } =
    req.query;
  const filter = { userRef: String(userId) };

  if (type) filter.type = type;
  if (intensity) filter.intensity = intensity;

  if (minDuration || maxDuration) {
    filter.duration = {};
    if (minDuration) filter.duration.$gte = Number(minDuration);
    if (maxDuration) filter.duration.$lte = Number(maxDuration);
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (q) {
    // q is for general search (name, type, notes)
    const regex = new RegExp(q, "i");
    return {
      $and: [
        filter,
        { $or: [{ name: regex }, { type: regex }, { notes: regex }] },
      ],
    };
  }
  return filter;
};

// POST /api/workout -> create workout
export const createWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return next(errorHandler(401, "Unauthorized"));

    const newWorkout = new Workout({
      ...req.body,
      userRef: String(userId), // enforce ownership server-side
    });
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    next(error);
  }
};

// GET /api/workout -> list workouts with optional search & filters
export const getWorkouts = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return next(errorHandler(401, "Unauthorized"));

    const query = buildWorkoutQuery(req, userId);
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-date"; // e.g. date, -date, duration, -duration

    const [total, workouts] = await Promise.all([
      Workout.countDocuments(query),
      Workout.find(query).sort(sort).skip(skip).limit(limit).lean(),
    ]);

    res.json({
      workouts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1, // at least 1 page
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/workout/:id -> single workout
export const getWorkoutById = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return next(errorHandler(401, "Unauthorized"));

    const workout = await Workout.findById(req.params.id).lean();
    if (!workout) return next(errorHandler(404, "Workout not found"));
    if (String(workout.userRef) !== String(userId))
      return next(errorHandler(403, "Forbidden"));

    res.json(workout);
  } catch (error) {
    next(error);
  }
};

// PUT /api/workout/:id -> update allowed fields
export const updateWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return next(errorHandler(401, "Unauthorized"));

    const workout = await Workout.findById(req.params.id);
    if (!workout) return next(errorHandler(404, "Workout not found"));
    if (String(workout.userRef) !== String(userId))
      return next(errorHandler(403, "Forbidden"));

    const allowed = ["type", "name", "duration", "date", "intensity", "notes"];
    for (const field of allowed) {
      if (field in req.body) workout[field] = req.body[field];
    }
    const updated = await workout.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/workout/:id
export const deleteWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return next(errorHandler(401, "Unauthorized"));

    const workout = await Workout.findById(req.params.id);
    if (!workout) return next(errorHandler(404, "Workout not found"));
    if (String(workout.userRef) !== String(userId))
      return next(errorHandler(403, "Forbidden"));

    await workout.deleteOne();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
