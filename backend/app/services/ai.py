from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_task_priority(title: str, description: str) -> dict:
    try:
        prompt = f"""Analyze this task and return a JSON response with priority and summary.

Task Title: {title}
Task Description: {description}

Return ONLY a JSON object like this:
{{
    "priority": "low|medium|high|critical",
    "summary": "one line summary of the task",
    "reasoning": "why this priority was assigned"
}}

Priority guidelines:
- critical: security issues, production bugs, data loss risks
- high: important features, blocking issues, deadline approaching
- medium: regular features, improvements
- low: nice to have, documentation, minor fixes"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )

        content = response.choices[0].message.content
        # Clean JSON
        content = content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        result = json.loads(content)
        return result

    except Exception as e:
        return {
            "priority": "medium",
            "summary": title,
            "reasoning": "AI analysis failed, defaulting to medium"
        }

def generate_task_summary(title: str, description: str) -> str:
    try:
        prompt = f"""Summarize this task in one clear sentence.

Title: {title}
Description: {description}

Return ONLY the summary sentence, nothing else."""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return title