import Cors from 'cors';

// Initialize CORS middleware with your settings
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  origin: 'http://localhost:8080', // Adjust this if needed
});

// Helper function to run middleware
export function runMiddleware(req, res) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve();
    });
  });
}
