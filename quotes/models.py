from django.db import models

# Create your models here.

class Quote(models.Model):
    """A quote with text and author."""
    text = models.TextField()
    author = models.CharField(max_length=100)

    def __str__(self):
        return f'"{self.text}" - {self.author}'
