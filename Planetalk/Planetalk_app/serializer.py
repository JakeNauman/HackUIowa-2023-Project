from rest_framework import serializers
from .models import *

# class GPTResponseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = GPTResponse
#         fields = ['Response']

# class GPTRequestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = GPTRequest
#         fields = ['UserRequest', 
#                   'planetIndex', 
#                   'educationIndex']