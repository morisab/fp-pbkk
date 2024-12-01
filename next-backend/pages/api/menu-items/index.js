import pool from '../../../lib/db';
import { verifyToken, verifyAdmin } from '../../../lib/auth'; // Verifikasi token dan admin
import { runMiddleware } from '../../../lib/cors'; // Middleware CORS

export default async function handler(req, res) {
    // Menjalankan middleware CORS
    await runMiddleware(req, res, () => {});

    if (req.method === 'GET') {
        // Mendapatkan semua menu item
        try {
            console.log('Verifying token...'); // Log untuk melihat proses verifikasi token
            verifyToken(req);

            console.log('Fetching all menu items'); // Log untuk melihat jika query sedang dijalankan
            const [rows] = await pool.query('SELECT * FROM menu_items');
            console.log('Fetched menu items:', rows); // Log hasil query menu items

            return res.status(200).json(rows); // Mengirimkan semua menu item
        } catch (error) {
            console.error('Error fetching menu items:', error); // Log error yang terjadi
            return res.status(500).json({ message: 'Database error', error: error.message });
        }
    } else if (req.method === 'POST') {
        // Handle POST request untuk menambah menu item
        try {
            console.log('Verifying token and admin rights for creating menu item...'); // Log verifikasi token dan admin
            verifyToken(req); // Verifikasi token
            verifyAdmin(req); // Verifikasi admin

            const { name, price, description, category } = req.body;
            console.log('Request body for POST:', req.body); // Log data body yang diterima

            // Validasi input
            if (!name || typeof name !== 'string' || name.length > 255) {
                return res.status(400).json({ message: 'Invalid name' });
            }
            if (typeof price !== 'number') {
                return res.status(400).json({ message: 'Invalid price' });
            }
            if (description && (typeof description !== 'string' || description.length > 1000)) {
                return res.status(400).json({ message: 'Invalid description' });
            }
            if (category && (typeof category !== 'string' || category.length > 255)) {
                return res.status(400).json({ message: 'Invalid category' });
            }

            console.log('Inserting new menu item:', { name, price, description, category }); // Log data yang akan dimasukkan

            const [result] = await pool.query(
                'INSERT INTO menu_items (name, price, description, category) VALUES (?, ?, ?, ?)',
                [name, price, description, category]
            );

            const menuItem = { id: result.insertId, name, price, description, category };
            console.log('New menu item created with ID:', menuItem.id); // Log ID dari menu item baru

            return res.status(201).json({ message: 'Menu item created successfully!', menu_item: menuItem });
        } catch (error) {
            console.error('Error creating menu item:', error); // Log error yang terjadi
            return res.status(500).json({ message: 'Database error', error: error.message });
        }
    } else {
        // Jika metode selain GET atau POST
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
