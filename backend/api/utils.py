from dotenv import load_dotenv
import os
import cohere

load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.Client(COHERE_API_KEY)

def ai_summary(description, age, sex, duration, medications, history, weight):
    prompt = f"""
The use has reported symptoms and medical information as follows:

Symptoms: "{description}"
Age: {age}
Sex: {sex}
Symptom Duration: {duration}
Current Medications: {medications}
Medical History: {history}
Weight: {weight} kg

Please:
1. Provide a clear and concise summary in plain language.
2. Suggest 1–3 potential conditions that could be associated with the symptoms.
3. Recommend next steps for care (e.g., rest, book appointment, seek urgent care).
4. Mention any red flags that require immediate medical attention.

Be neutral, factual, and do not give a diagnosis.

Format:
Summary:
[summary here]

Possible Conditions:
- [condition]
- [condition]

Recommendations:
- [next steps]

Warning Signs:
- [red flags]
"""

    try:
        response = co.generate(
            model="command-r-plus",
            prompt=prompt,
            max_tokens=350,
            temperature=0.4
        )
        return response.generations[0].text.strip()
    except Exception as e:
        return f"Error: {str(e)}"
