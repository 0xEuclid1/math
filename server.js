const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 80;

app.use(bodyParser.json());

// React build dosyalarını statik olarak sun
app.use(express.static(path.join(__dirname, "build")));

// Öğrenci verilerini yükleme fonksiyonu
const loadStudentss = () => {
	try {
		const dataBuffer = fs.readFileSync("./students.json");
		return JSON.parse(dataBuffer);
	} catch (e) {
		return [];
	}
};

// API rotası: /students-json
app.get("/students-json", (req, res) => {
	const students = loadStudents();
	res.json(students);
});
// Öğrenci verilerini saklamak için
const filePath = "./students.json";

// API Rotaları: Öğrenci kaydetme
app.post("/save-student", (req, res) => {
	const { studentId, group } = req.body;

	if (!studentId || !group) {
		return res
			.status(400)
			.json({ error: "Öğrenci numarası ve grup seçimi gerekli!" });
	}

	const students = loadStudents();
	const existingStudent = students.find((s) => s.studentId === studentId);
	if (existingStudent) {
		return res
			.status(400)
			.json({ error: "Bu öğrenci numarasıyla zaten bir seçim yapılmış." });
	}

	students.push({ studentId, group });
	saveStudents(students);
	res.status(200).json({ message: "Seçiminiz başarıyla kaydedildi!" });
});

// React uygulamasındaki rotalar için wildcard kullanımı
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
	console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});

// Öğrenci verilerini yükle ve kaydetmek için dosya işlemleri
const loadStudents = () => {
	try {
		const dataBuffer = fs.readFileSync(filePath);
		return JSON.parse(dataBuffer);
	} catch (e) {
		return [];
	}
};

const saveStudents = (students) => {
	fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
};
