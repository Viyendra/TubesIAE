const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;
const SECRET_KEY = "rahasia_mahasehat";

let users = [
    { username: "admin", password: "123", role: "admin" },
    { username: "viyen", password: "123", role: "dokter" },
    { username: "april", password: "123", role: "dokter" },
    { username: "jingga", password: "123", role: "pasien" },
    { username: "bunga", password: "123", role: "pasien" },
    { username: "budi", password: "123", role: "pasien" }
];

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "Username sudah dipakai!" });
    }
    users.push({ username, password, role: "pasien" });
    res.json({ message: "Registrasi berhasil! Silakan login." });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY);
        res.json({ token, role: user.role, username: user.username });
    } else {
        res.status(401).json({ message: "Username atau Password salah" });
    }
});


app.get('/users', (req, res) => {
    res.json(users);
});

app.delete('/users/:username', (req, res) => {
    const { username } = req.params;
    const initial = users.length;
    users = users.filter(u => u.username !== username);
    
    if(users.length < initial) res.json({ message: "User dihapus." });
    else res.status(404).json({ message: "User tidak ditemukan." });
});

app.put('/users/:username', (req, res) => {
    const { username } = req.params;
    const { newRole } = req.body;
    const user = users.find(u => u.username === username);
    
    if(user) {
        user.role = newRole;
        res.json({ message: `Role ${username} berubah menjadi ${newRole}` });
    } else {
        res.status(404).json({ message: "User error" });
    }
});

app.listen(PORT, () => console.log(`Auth Service on ${PORT}`));