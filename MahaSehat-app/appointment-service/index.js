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

    appointments.forEach(appt => {
        if (appt.status !== 'completed') {
            if (currentDateStr > appt.date || (currentDateStr === appt.date && currentTimeStr >= appt.time)) {
                appt.status = 'completed';
            }
        }
    });
}, 30000); 

app.post('/create', (req, res) => {
    const { doctorName, date, time } = req.body;
    const newSlot = { 
        id: Date.now(), 
        doctorName, date, time, 
        status: 'available', 
        patientName: null 
    };
    appointments.push(newSlot);
    res.json({ message: "Created", data: newSlot });
});

app.get('/', (req, res) => {
    const sorted = appointments.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    res.json(sorted);
});

app.get('/doctor/:doctorName', (req, res) => {
    const { doctorName } = req.params;
    const mySchedule = appointments.filter(a => a.doctorName === doctorName);
    mySchedule.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    res.json(mySchedule);
});

app.post('/book', (req, res) => {
    const { id, patientName } = req.body;
    const slot = appointments.find(a => a.id == id);
    if (slot && slot.status === 'available') {
        slot.status = 'booked';
        slot.patientName = patientName;
        res.json({ message: "Booked" });
    } else {
        res.status(400).json({ message: "Failed" });
    }
});

app.post('/cancel', (req, res) => {
    const { id } = req.body;
    const slot = appointments.find(a => a.id == id);
    if (slot && slot.status === 'booked') {
        slot.status = 'available';
        slot.patientName = null;
        res.json({ message: "Canceled" });
    } else {
        res.status(400).json({ message: "Cannot cancel" });
    }
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    appointments = appointments.filter(a => a.id != id);
    res.json({ message: "Deleted" });
});

app.delete('/clear-history/:doctorName', (req, res) => {
    const { doctorName } = req.params;
    const initialCount = appointments.length;
    
    appointments = appointments.filter(a => !(a.doctorName === doctorName && a.status === 'completed'));
    
    const deletedCount = initialCount - appointments.length;
    res.json({ message: `Berhasil menghapus ${deletedCount} riwayat jadwal.` });
});

app.listen(PORT, () => console.log(`Appointment Service running on port ${PORT}`));