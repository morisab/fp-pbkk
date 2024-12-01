import { runMiddleware } from '../../../lib/cors'; // Import middleware CORS

export default async function handler(req, res) {
    // Menjalankan middleware CORS
    await runMiddleware(req, res, () => {});

    if (req.method === 'POST') {
        // Di sisi frontend, cukup hapus token dari penyimpanan lokal atau cookie
        return res.json({ message: 'Logout successful!' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}
