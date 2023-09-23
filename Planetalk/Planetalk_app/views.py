from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.shortcuts import render
# from rest_framework.views import APIView
# from .models import *
# from .serializer import *
# from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.response import Response

def home(request):
    return render(request, 'home.html')

@api_view(['POST'])
def GPTResponse(request):
    question = request.data['question']
    planet = request.data['planetIndex']
    education = request.data['educationIndex']
    # call chat bot from ChatGPT folder
    response = "This is a response from the chatbot"
    return Response({'response': response})

# class GPTResponseView(APIView):
#     def get(self, request):
#         output = GPTResponse.objects.all()
#         serializer = GPTResponseSerializer(output, many=True)
#         return Response(serializer.data)
    
# class GPTRequestView(APIView):
#     def get(self, request):
#         output = GPTRequest.objects.all()
#         serializer = GPTRequestSerializer(output, many=True)
#         return Response(serializer.data)
    
#     def post(self, request):
#         serializer = GPTRequestSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors)
