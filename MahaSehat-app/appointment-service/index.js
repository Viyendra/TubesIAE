const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3002;
let appointments = []; 

setInterval(() => {
    const nowUTC = new Date();
    
    const nowWIB = new Date(nowUTC.getTime() + (7 * 60 * 60 * 1000));
    const currentTimeStr = nowWIB.toISOString().slice(11, 16); 
    const currentDateStr = nowWIB.toISOString().slice(0, 10); 

    console.log(`[SYSTEM CEK] Waktu Server (WIB): ${currentDateStr} ${currentTimeStr}`);

    appointments.forEach(appt => {
        if (appt.status !== 'completed') {
            if (currentDateStr > appt.date || (currentDateStr === appt.date && currentTimeStr >= appt.time)) {
                appt.status = 'completed';
                console.log(`--> Jadwal ID ${appt.id} (Dr. ${appt.doctorName}) telah SELESAI.`);
            }
        }
    });
}, 30000);

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
    const sorted = appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(sorted);
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
        res.status(400).json({ message: "Gagal booking" });
    }
});

app.post('/cancel', (req, res) => {
    const { id } = req.body;
    const slot = appointments.find(a => a.id === id);
    
    if (slot) {
        slot.status = 'available'; 
        slot.patientName = null;  
        res.json({ message: "Booking dibatalkan", data: slot });
    } else {
        res.status(404).json({ message: "Jadwal tidak ditemukan" });
    }
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = appointments.length;
    appointments = appointments.filter(a => a.id !== parseInt(id));
    
    if (appointments.length < initialLength) {
        res.json({ message: "Jadwal berhasil dihapus" });
    } else {
        res.status(404).json({ message: "Gagal menghapus" });
    }
});

app.listen(PORT, () => console.log(`Appointment Service running on port ${PORT}`));