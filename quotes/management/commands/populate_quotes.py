from django.core.management.base import BaseCommand
from quotes.models import Quote
import random

SAMPLE_QUOTES = [
    {"text": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
    {"text": "Life is what happens when you're busy making other plans.", "author": "John Lennon"},
    {"text": "Success is not final, failure is not fatal: It is the courage to continue that counts.", "author": "Winston Churchill"},
    {"text": "You miss 100% of the shots you don't take.", "author": "Wayne Gretzky"},
    {"text": "Whether you think you can or you think you can't, you're right.", "author": "Henry Ford"},
    {"text": "The best way to get started is to quit talking and begin doing.", "author": "Walt Disney"},
    {"text": "Don't watch the clock; do what it does. Keep going.", "author": "Sam Levenson"},
    {"text": "If you want to lift yourself up, lift up someone else.", "author": "Booker T. Washington"},
    {"text": "Strive not to be a success, but rather to be of value.", "author": "Albert Einstein"},
    {"text": "I have not failed. I've just found 10,000 ways that won't work.", "author": "Thomas Edison"},
]

class Command(BaseCommand):
    help = 'Populate the database with sample quotes.'

    def handle(self, *args, **kwargs):
        for item in SAMPLE_QUOTES:
            Quote.objects.get_or_create(text=item["text"], author=item["author"])
        self.stdout.write(self.style.SUCCESS('Sample quotes have been added.'))

        quotes = Quote.objects.all()
        quote = random.choice(quotes) if quotes else None 