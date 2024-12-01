import Cors from 'cors';

// Inisialisasi CORS dengan konfigurasi yang sesuai
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  origin: 'http://localhost:8080', // Hanya izinkan permintaan dari frontend di port 8080
});

// Fungsi middleware untuk menjalankan CORS
export function runMiddleware(req, res, next) {
  cors(req, res, (result) => {
    if (result instanceof Error) {
      return next(result);
    }
    next();
  });
}
