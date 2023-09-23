from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.shortcuts import render
# from rest_framework.views import APIView
# from .models import *
# from .serializer import *
# from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.response import Response
# bring in planetBot.py from ChatGPT folder
from .ChatGPT.planetBot import *


def home(request):
    return render(request, 'home.html')

@api_view(['POST'])
def GPTResponse(request):
    question = request.data['message']
    planet = request.data['planetIndex']
    education = request.data['educationIndex']
    # call chat bot from ChatGPT folder
    response = GPTReponse(planet, education, question)
    # if response contains "Error", return error message
    if "Error" in response:
      response = "Sorry, I couldn't find an answer. Please try again."
    return Response({'message': response})

@api_view(['POST'])
def getIntro(request):
    planetID = int(request.data['planetIndex'])
    response = getPlanetIntro(planetID)
    return Response({'message': response})

