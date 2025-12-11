const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3002;
let appointments = [];

app.post('/create', (req, res) => {
    const { doctorName, date, time } = req.body;
    const newSlot = { id: appointments.length + 1, doctorName, date, time, status: 'available' };
    appointments.push(newSlot);
    res.json(newSlot);
});

app.get('/', (req, res) => {
    res.json(appointments);
});

app.post('/book', (req, res) => {
    const { id, patientName } = req.body;
    const slot = appointments.find(a => a.id === id);
    if (slot && slot.status === 'available') {
        slot.status = 'booked';
        slot.patientName = patientName;
        res.json({ message: "Booking sukses", data: slot });
    } else {
        res.status(400).json({ message: "Jadwal tidak tersedia" });
    }
});

app.listen(PORT, () => console.log(`Appointment Service running on port ${PORT}`));