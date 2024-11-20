const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Koneksi database menggunakan mysql2
const pool = mysql.createPool({
    host: 'localhost', // Ganti dengan host Anda jika perlu
    user: 'root', // Ganti dengan username database Anda
    password: '', // Ganti dengan password database Anda
    database: 'hasu', // Ganti dengan nama database Anda
});

// Fungsi untuk mengupdate password dengan bcrypt
async function updatePasswords() {
    try {
        // Ambil semua user dari database
        pool.query('SELECT id, is_admin, password FROM users', async (err, results) => {
            if (err) {
                console.error('Gagal mengambil data pengguna:', err);
                return;
            }

            for (const user of results) {
                let newPassword;

                // Tentukan password berdasarkan kondisi is_admin
                if (user.is_admin === 1) {
                    newPassword = 'admin'; // Jika is_admin = 1, set password 'admin'
                } else {
                    newPassword = 'password'; // Jika is_admin = 0, set password 'password'
                }

                // Lakukan hash ulang pada password
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // Perbarui password di database
                pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id], (updateErr, updateResults) => {
                    if (updateErr) {
                        console.error('Gagal mengupdate password:', updateErr);
                    } else {
                        console.log(`Password untuk user dengan ID ${user.id} telah diupdate.`);
                    }
                });
            }

            console.log("Update password selesai.");
        });
    } catch (error) {
        console.error("Gagal mengupdate password:", error);
    }
}

// Panggil fungsi untuk mengupdate password
updatePasswords();
