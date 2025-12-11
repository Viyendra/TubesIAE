const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3003;
let prescriptions = [];

app.post('/add', (req, res) => {
    const { patientName, medicine, dosage, doctorName } = req.body;
    const newPrescription = {
        id: Date.now(),
        patientName, medicine, dosage, doctorName,
        date: new Date()
    };
    prescriptions.push(newPrescription);
    res.json({ message: "Resep dikirim" });
});

app.get('/:patientName', (req, res) => {
    const { patientName } = req.params;
    const myPrescriptions = prescriptions.filter(p => p.patientName === patientName);
    myPrescriptions.sort((a,b) => new Date(b.date) - new Date(a.date));
    res.json(myPrescriptions);
});

app.delete('/:id', (req, res) => {
    const { id } = req.params;
    prescriptions = prescriptions.filter(p => p.id != id);
    res.json({ message: "Resep dihapus dari daftar." });
});

app.listen(PORT, () => console.log(`Prescription Service on ${PORT}`));