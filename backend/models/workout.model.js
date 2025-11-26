import mongoose from 'mongoose';

{/* Schema/model for workouts */}
const workoutSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: { // Date of the workout
        type: Date,
        required: true,
    },
    intensity: {
        type: String,
        required: true,
        default: "Moderate",
    },
    notes: {
        type: String,
    },
    userRef: { // Reference to the user who logged the workout
        type: String,
        required: true,
    },
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout; 