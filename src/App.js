import React, { useState } from "react";

function App() {
	const [studentId, setStudentId] = useState("");
	const [group, setGroup] = useState("");
	const [agreed, setAgreed] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!studentId || !group || !agreed) {
			alert("Lütfen tüm alanları doldurun ve onay kutusunu işaretleyin.");
			return;
		}

		try {
			const response = await fetch("http://omuexam.xyz/save-student", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ studentId, group }),
			});

			const data = await response.json();

			if (response.ok) {
				setSubmitted(true);
			} else {
				setError(data.error);
			}
		} catch (err) {
			setError("Bir hata oluştu, lütfen tekrar deneyin.");
		}
	};

	return (
		<div className="container mt-5">
			<h2 className="text-center mb-4">Matematik I Dersi Grup Seçimi</h2>
			{submitted ? (
				<div className="alert alert-success" role="alert">
					Seçiminiz başarıyla kaydedildi!
				</div>
			) : (
				<form onSubmit={handleSubmit} className="card p-4 shadow-sm">
					<div className="form-group mb-3">
						<label htmlFor="studentId">Öğrenci Numarası</label>
						<input
							type="number"
							className="form-control"
							id="studentId"
							value={studentId}
							onChange={(e) => setStudentId(e.target.value)}
							placeholder="Öğrenci Numaranızı Girin"
						/>
					</div>
					<div className="form-group mb-3">
						<label>Grup Seçimi</label>
						<div className="form-check">
							<input
								className="form-check-input"
								type="radio"
								id="morning"
								name="group"
								value="1"
								onChange={(e) => setGroup(e.target.value)}
							/>
							<label className="form-check-label" htmlFor="morning">
								Sabah Grubu (Çarşamba 08:15-12:00 )
							</label>
						</div>
						<div className="form-check">
							<input
								className="form-check-input"
								type="radio"
								id="afternoon"
								name="group"
								value="2"
								onChange={(e) => setGroup(e.target.value)}
							/>
							<label className="form-check-label" htmlFor="afternoon">
								Öğleden Sonra Grubu (Çarşamba 13:15-17:00 )
							</label>
						</div>
					</div>
					<div className="form-group form-check mb-3">
						<input
							type="checkbox"
							className="form-check-input"
							id="agree"
							checked={agreed}
							onChange={(e) => setAgreed(e.target.checked)}
						/>
						<label className="form-check-label" htmlFor="agree">
							Bu seçimimin kesin olmadığını ve sadece talep toplamak için olduğunu
							okudum ve anladım.
						</label>
					</div>
					{error && <div className="alert alert-danger">{error}</div>}
					<button type="submit" className="btn btn-primary w-100">
						Seçimi Gönder
					</button>
				</form>
			)}
		</div>
	);
}

export default App;
