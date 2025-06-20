from django.shortcuts import render
import random
from .models import Quote
from django.http import JsonResponse

# View for the random quote generator
def random_quote(request):
    quotes = Quote.objects.all()
    quote = random.choice(quotes) if quotes else None
    return render(request, 'quotes/random_quote.html', {'quote': quote})

def api_random_quote(request):
    quotes = Quote.objects.all()
    quote = random.choice(quotes) if quotes else None
    if quote:
        return JsonResponse({"text": quote.text, "author": quote.author})
    else:
        return JsonResponse({"text": "No quotes available.", "author": ""})
