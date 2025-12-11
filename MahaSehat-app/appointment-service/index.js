const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3002;
let appointments = []; 

setInterval(() => {
    const now = new Date();
    console.log(`[SYSTEM] Checking schedules at ${now.toLocaleTimeString()}...`);

    appointments.forEach(appt => {
        const scheduleDate = new Date(`${appt.date}T${appt.time}`);
        
        if (appt.status === 'booked' && scheduleDate < now) {
            appt.status = 'completed';
            console.log(`Jadwal ID ${appt.id} selesai automatically.`);
        }
    });
}, 60000);

app.post('/create', (req, res) => {
    const { doctorName, date, time } = req.body;
    const newSlot = { 
        id: appointments.length + 1, 
        doctorName, 
        date, 
        time, 
        status: 'available',
        patientName: null 
    };
    appointments.push(newSlot);
    res.json({ message: "Jadwal dibuat", data: newSlot });
});

app.get('/', (req, res) => {
    res.json(appointments);
});

app.get('/doctor/:doctorName', (req, res) => {
    const { doctorName } = req.params;
    const docSchedules = appointments.filter(a => a.doctorName === doctorName);
    res.json(docSchedules);
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