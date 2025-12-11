const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const PORT = 3001;
const SECRET_KEY = "rahasia_mahasehat";
const users = [
    { username: "dokterBudi", password: "123", role: "dokter" },
    { username: "dokterViyen", password: "123", role: "dokter" },
    { username: "ani", password: "123", role: "pasien" },
    { username: "budi", password: "123", role: "pasien" },
    { username: "citra", password: "123", role: "pasien" }
];

app.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: "Username sudah ada!" });
    }

    users.push({ username, password, role });
    res.json({ message: "User berhasil dibuat", user: { username, role } });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(404).json({ 
            message: "AKSES DIBLOKIR: User tidak ditemukan di sistem kami." 
        });
    }
    if (user.password !== password) {
        return res.status(401).json({ 
            message: "AKSES DIBLOKIR: Password anda salah." 
        });
    }
    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY);
    res.json({ 
        message: "Login Berhasil",
        token, 
        role: user.role 
    });
});

app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));