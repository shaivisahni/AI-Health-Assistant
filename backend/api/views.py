from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import ai_summary

@api_view(['POST'])
def suggest(request):
    desc = request.data.get("description", "")
    age = request.data.get("age", "")
    sex = request.data.get("sex", "")
    duration = request.data.get("duration", "")
    medications = request.data.get("medications", "")
    history = request.data.get("history", "")
    weight = request.data.get("weight", "")

    if not desc or len(desc.strip()) < 10:
        return Response({
            "summary": "Please describe your symptoms in more detail.",
        })

    summary = ai_summary(desc, age, sex, duration, medications, history, weight)
    return Response({ "summary": summary })
