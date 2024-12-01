import pool from '../../../lib/db'; // Pastikan import path sesuai dengan struktur proyek Anda
import { verifyToken, verifyAdmin } from '../../../lib/auth'; // Verifikasi token dan admin
import { runMiddleware } from '../../../lib/cors'; // Middleware CORS

// Handle GET, PUT, DELETE requests for a menu item by ID
export default async function handler(req, res) {
    // Menjalankan middleware CORS
    await runMiddleware(req, res, () => {});

    const { id } = req.query; // Ambil ID dari query parameter
    console.log('Received ID:', id); // Log ID untuk debugging

    if (req.method === 'GET') {
        // Handle GET request untuk mengambil menu item berdasarkan ID
        try {
            console.log('Verifying token...'); // Log untuk melihat proses verifikasi token
            verifyToken(req);

            console.log('Fetching menu item with ID:', id); // Log untuk melihat ID yang digunakan dalam query
            const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
            const menuItem = rows[0];

            if (!menuItem) {
                console.log('Menu item not found'); // Log jika menu item tidak ditemukan
                return res.status(404).json({ message: 'Menu item not found' });
            }

            console.log('Menu item found:', menuItem); // Log menu item yang ditemukan
            return res.status(200).json(menuItem); // Mengirimkan menu item jika ditemukan
        } catch (error) {
            console.error('Error fetching menu item:', error); // Log error yang terjadi
            return res.status(500).json({ message: 'Database error', error: error.message });
        }
    } else if (req.method === 'PUT') {
        // Handle PUT request untuk update menu item
        try {
            console.log('Verifying token and admin rights...'); // Log verifikasi token dan admin
            verifyToken(req); // Verifikasi token
            verifyAdmin(req); // Verifikasi admin

            const { name, price, description, category } = req.body;
            console.log('Request body:', req.body); // Log data body yang diterima

            // Ambil data menu item berdasarkan ID
            const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
            const menuItem = rows[0];

            if (!menuItem) {
                console.log('Menu item not found'); // Log jika menu item tidak ditemukan
                return res.status(404).json({ message: 'Menu item not found' });
            }

            // Update hanya field yang diberikan
            const updates = {};
            if (name) updates.name = name;
            if (price) updates.price = price;
            if (description) updates.description = description;
            if (category) updates.category = category;

            console.log('Updating menu item with:', updates); // Log data yang akan diupdate

            // Melakukan update data
            await pool.query('UPDATE menu_items SET ? WHERE id = ?', [updates, id]);

            console.log('Menu item updated successfully'); // Log jika update berhasil
            return res.status(200).json({ message: 'Menu item updated successfully!', menu_item: { ...menuItem, ...updates } });
        } catch (error) {
            console.error('Error updating menu item:', error); // Log error yang terjadi
            return res.status(500).json({ message: 'Database error', error: error.message });
        }
    } else if (req.method === 'DELETE') {
        // Handle DELETE request untuk menghapus menu item
        try {
            console.log('Verifying token and admin rights for delete...'); // Log verifikasi token dan admin
            verifyToken(req); // Verifikasi token
            verifyAdmin(req); // Verifikasi admin

            // Menghapus menu item berdasarkan ID
            const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                console.log('Menu item not found for deletion'); // Log jika menu item tidak ditemukan untuk dihapus
                return res.status(404).json({ message: 'Menu item not found' });
            }

            console.log('Menu item deleted successfully'); // Log jika delete berhasil
            return res.status(200).json({ message: 'Menu item deleted successfully!' });
        } catch (error) {
            console.error('Error deleting menu item:', error); // Log error yang terjadi
            return res.status(500).json({ message: 'Database error', error: error.message });
        }
    } else {
        // Jika metode selain GET, PUT, DELETE
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
