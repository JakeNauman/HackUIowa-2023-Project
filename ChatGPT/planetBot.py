import os
import openai

# Varaibles
isTesting = True # turn off in production
keyFile = 'key.private'
planetOrder = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
# index each level of education 0-5
educationLevel = ['elementary student', 'middle school student', 'high school student', 'college student', 'graduate student', 'researcher']

# read api key file
def getKeys():
  if isTesting:
    print("getKeys")
  keys = {}
  with open(keyFile, 'r') as f:
      for row in f:
        row = row.strip().split(':')
        # add key to dict
        keys[row[0]] = row[1]
  # if isTesting:
  #   for key in keys:
  #       print(key, keys[key])
  return keys

def getPlanetPersona(planetIndex, educationIndex):
  if isTesting:
    print("getPlanetInfo: " + str(planetOrder[planetIndex]) + " " + str(educationIndex))
  
  planetName = str(planetOrder[planetIndex])
  if planetName in planetOrder:
    return createPersona(planetIndex, educationIndex)
  else:
    raise "Error: Planet not found."

def createPersona(planetIndex, educationIndex):
  planetName = planetOrder[planetIndex]
  if isTesting:
    print("createPersona for " + planetName)
  persona = f"In this conversation, you are {planetName}, the {planetIndex+1}th planet from the Sun in our solar system. Your goal is to provide factual information about {planetName}'s astronomical characteristics, history, and any relevant details. Respond to questions as if you are {planetName} itself, using 'I' and 'my' to refer to yourself. Please explain all topics between the education level of a {educationLevel[educationIndex]}. Please do not deviate from this persona."
  return persona


def GPTReponse(planetIndex, educationIndex):
  if isTesting:
    print("GPTReponse")

  openai.api_key = getKeys()['OPENAI_API_KEY']
  response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": getPlanetPersona(planetIndex, educationIndex)},
        # {"role": "assistant", "content": f"Please introduce yourself. Then ask the user what they would like to know about {planetOrder[planetIndex]}."},
        # {"role": "user", "content": "how many moons do you have?"},
    ],
    max_tokens=100,
    temperature=1,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0,
  )
  reply = response['choices'][0]['message']['content']
  print(f"ChatGPT: {reply}")

def main():
  if isTesting:
    print("Welcome to Planet-Talk ChatGPT!")
    print(getPlanetPersona(5, 3))
  GPTReponse(5, 3)

if __name__ == "__main__":
  main()
