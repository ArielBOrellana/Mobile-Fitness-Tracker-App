{/* Utility function to create a standardized error object.
 This function helps centralize error handling by generating
 an error object with a custom status code and message */}
 
export const errorHandler = (statusCode, message) => {
    const error = new Error(); // Create a new Error instance
    error.statusCode = statusCode; // Assign the custom status code
    error.message = message; // Assign the custom error message
    return error; // Return the constructed error object
}
