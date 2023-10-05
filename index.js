//Out-Patient appointment system
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 5000;


const app = express();


app.use(cors());


app.use(bodyParser.json());


class Doctor {
    constructor(name, availableDays, availableTimes, maxPatientsPerDay) {
        this.name = name;
        this.availableDays = availableDays;
        this.availableTimes = availableTimes;
        this.maxPatientsPerDay = maxPatientsPerDay;
        this.patients = [];
    }


    toJsonObject() {
        return {
            name: this.name,
            availableDays: this.availableDays,
            availableTimes: this.availableTimes,
            maxPatientsPerDay: this.maxPatientsPerDay,
            patients: this.patients
        };
    }
}


const doctors = [
    new Doctor("Dr. Smith", ["Monday", "Wednesday", "Friday"], ["17:00", "18:00"], 10),
    new Doctor("Dr. Jones", ["Tuesday", "Thursday", "Saturday"], ["16:00", "17:00"], 15),
    new Doctor("Dr. Brown", ["Monday", "Wednesday", "Friday"], ["14:00", "15:00"], 12),
    new Doctor("Dr. Patel", ["Tuesday", "Thursday", "Saturday"], ["15:30", "16:30"], 18),
    new Doctor("Dr. Lee", ["Monday", "Wednesday", "Friday"], ["16:30", "17:30"], 9),
    new Doctor("Dr. Miller", ["Tuesday", "Thursday", "Saturday"], ["17:00", "18:00"], 14),
    new Doctor("Dr. Garcia", ["Monday", "Wednesday", "Friday"], ["14:30", "15:30"], 11),
    new Doctor("Dr. Kim", ["Tuesday", "Thursday", "Saturday"], ["15:00", "16:00"], 16),
    new Doctor("Dr. Wilson", ["Monday", "Wednesday", "Friday"], ["17:30", "18:30"], 13),
    new Doctor("Dr. Murphy", ["Tuesday", "Thursday", "Saturday"], ["16:30", "17:30"], 20),
    new Doctor("Dr. Clark", ["Monday", "Wednesday", "Friday"], ["15:00", "16:00"], 8),
    new Doctor("Dr. Anderson", ["Tuesday", "Thursday", "Saturday"], ["14:00", "15:00"], 17)
];



app.get("/", (req, res) => {
    res.send("Hello from the root path!");
});


app.get("/doctors", (req, res) => {
    res.json(doctors.map(doctor => doctor.toJsonObject()));
});

app.get("/doctors/:name", (req, res) => {
    const name = req.params.name;
    const doctor = doctors.find(doctor => doctor.name === name);
    if (doctor) {
        res.json(doctor.toJsonObject());
    } else {
        res.status(404).json({ error: "Doctor not found." });
    }
});


app.post("/doctors/:name/appointments", (req, res) => {
    const doctor = doctors.find(doctor => doctor.name === req.params.name);
    if (doctor) {

        const date = req.body.date;
        const time = req.body.time;


        if (doctor.availableDays.includes(date) && doctor.availableTimes.includes(time)) {


            const appointments = doctor.patients.filter(patient => patient.date === date && patient.time === time);


            if (appointments.length === 0) {
                doctor.patients.push({ date, time });
                res.json({ message: "Appointment booked successfully." });
            } else {
                res.status(409).json({ error: "Doctor is already booked on the given date and time." });
            }
        } else {
            res.status(400).json({ error: "Doctor is not available on the given date and time." });
        }
    } else {
        res.status(404).json({ error: "Doctor not found." });
    }
});


app.get("/doctors/:name/appointments", (req, res) => {
    const doctor = doctors.find(doctor => doctor.name === req.params.name);
    if (doctor) {
        const k = res.json({ availableTimes: doctor.availableTimes, availableDays: doctor.availableDays });

    } else {
        res.status(404).json({ error: "Doctor not found." });
    }
});


app.listen(PORT, () => {
    console.log(`Server listening on port  ${PORT}`)
});
