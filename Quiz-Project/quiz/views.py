from django.http import JsonResponse
from .models import Category, Question
import random

def get_categories(request):
    categories = Category.objects.all()
    data = {
        "trivia_categories": [{"id": cat.id, "name": cat.name} for cat in categories]
    }
    return JsonResponse(data)

def get_questions(request):
    # گرفتن پارامترها از URL (مثلا ?amount=5&difficulty=easy)
    amount = int(request.GET.get('amount', 5))
    category_id = request.GET.get('category')
    difficulty = request.GET.get('difficulty')

    # فیلتر کردن سوالات بر اساس پارامترها
    queryset = Question.objects.all()
    if category_id:
        queryset = queryset.filter(category_id=category_id)
    if difficulty:
        queryset = queryset.filter(difficulty=difficulty)

    # انتخاب تصادفی سوالات
    questions = list(queryset)
    random.shuffle(questions)
    selected_questions = questions[:amount]

    if not selected_questions:
        return JsonResponse({"response_code": 1, "results": []})

    # ساختاردهی خروجی دقیقاً مشابه Open Trivia DB
    results = []
    for q in selected_questions:
        results.append({
            "category": q.category.name,
            "type": "multiple",
            "difficulty": q.difficulty,
            "question": q.question,
            "correct_answer": q.correct_answer,
            "incorrect_answers": [q.incorrect_answer_1, q.incorrect_answer_2, q.incorrect_answer_3]
        })

    return JsonResponse({"response_code": 0, "results": results})
