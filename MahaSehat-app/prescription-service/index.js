const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3003; 
let prescriptions = [];

app.post('/add', (req, res) => {
    const { patientName, medicine, dosage, doctorName } = req.body;
    
    const newPrescription = {
        id: prescriptions.length + 1,
        patientName,
        medicine,
        dosage,
        doctorName,
        date: new Date()
    };
    
    prescriptions.push(newPrescription);
    res.json({ message: "Resep berhasil ditambahkan", data: newPrescription });
});

app.get('/:patientName', (req, res) => {
    const { patientName } = req.params;
    const myPrescriptions = prescriptions.filter(p => p.patientName === patientName);
    res.json(myPrescriptions);
});

app.listen(PORT, () => {
    console.log(`Prescription Service running on port ${PORT}`);
});