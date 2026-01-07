import React, { useState } from "react";
import "./App.css";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [duration, setDuration] = useState("");
  const [medication, setMedication] = useState("");
  const [history, setHistory] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const convertToKg = (value, unit) => {
    const val = parseFloat(value);
    if (isNaN(val)) return "";
    return unit === "lb" ? (val * 0.453592).toFixed(1) : val.toString();
  };

  const handleSubmit = async () => {
    setError("");
    setSummary("");
    setLoading(true);

    if (!symptoms || symptoms.length < 10) {
      setError("Please enter a more detailed symptom description.");
      setLoading(false);
      return;
    }

    const finalWeight = convertToKg(weight, weightUnit);

    const body = {
      description: symptoms,
      age: age || undefined,
      sex: sex || undefined,
      duration: duration || undefined,
      medications: medication || undefined,
      history: history || undefined,
      weight_kg: finalWeight || undefined,
    };

    try {
      const res = await fetch("http://localhost:8000/api/suggest/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.summary) setSummary(data.summary);
      else setError("The AI could not provide a suggestion based on the input.");
    } catch (e) {
      setError("Error connecting to the backend.");
    }

    setLoading(false);
  };

  return (
    <div className="health-app-container">
      <header className="health-app-header">
        <h1>Health AI Assistant</h1>
        <p className="subtitle">Get personalized health suggestions based on your symptoms</p>
      </header>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="symptoms">Symptoms Description</label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms in detail (e.g., location, severity, triggers)"
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Years"
              min="0"
              max="120"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sex">Sex</label>
            <select
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration of Symptoms</label>
          <input
            id="duration"
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 2 days, 3 weeks"
          />
        </div>

        <div className="form-group">
          <label htmlFor="medication">Current Medications</label>
          <input
            id="medication"
            type="text"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
            placeholder="List any medications you're taking"
          />
        </div>

        <div className="form-group">
          <label htmlFor="history">Medical History</label>
          <input
            id="history"
            type="text"
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            placeholder="Any relevant medical history"
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight</label>
          <div className="weight-input-group">
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Value"
              min="0"
            />
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Get Health Suggestions'}
        </button>

        {loading && <div className="spinner" />}

        {error && <div className="error-message">{error}</div>}

        {summary && (
          <div className="results-container">
            <h3>AI Health Summary</h3>
            <div className="results-content">{summary}</div>
          </div>
        )}
      </div>
    </div>
  );
}