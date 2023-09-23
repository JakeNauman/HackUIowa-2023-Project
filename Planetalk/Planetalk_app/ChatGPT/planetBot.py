import openai

# Varaibles
isTesting = False # turn off in production
keyFile = 'Planetalk_app/ChatGPT/key.private'
introFile = 'Planetalk_app/ChatGPT/planets.intros'
# index each 0-9
planetOrder = ['sun','mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
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
  persona = f"In this conversation, you are {planetName}, the {planetIndex+1}th planet from the Sun in our solar system. Your goal is to provide factual information about {planetName}'s astronomical characteristics, history, and any relevant details. Respond to questions as if you are {planetName} itself, using 'I' and 'my' to refer to yourself. Please explain all topics between the education level of a {educationLevel[educationIndex]}. Please be very concise. Please do not deviate from this persona."
  return persona

def getPlanetIntro(planetIndex):
  # open planets.intro file and read in the intro for the planet
  if isTesting:
    print("getIntro: " + str(planetOrder[planetIndex]))
  
  # open intro file and get in the intro for the planet
  with open(introFile, 'r') as f:
    for row in f:
      row = row.strip().split(':')
      # planet found in file, return intro
      if row[0] == planetOrder[planetIndex]:
        return row[1]
  raise "Error: Planet not found."

def GPTReponse(planetIndex, educationIndex, message):
  if isTesting:
    print("GPTReponse")

  openai.api_key = getKeys()['OPENAI_API_KEY']
  try:
    response = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[
          {"role": "system", "content": getPlanetPersona(planetIndex, educationIndex)},
          # {"role": "assistant", "content": f"Please introduce yourself. Then ask the user what they would like to know about {planetOrder[planetIndex]}."},
          {"role": "user", "content": message},
      ],
      max_tokens=120,
      temperature=.8,
      top_p=1,
      frequency_penalty=0.8,
      presence_penalty=0.3,
    )
    reply = response['choices'][0]['message']['content']
    if isTesting:
      print(f"ChatGPT: {reply}")
    return reply
  except:
    if isTesting:
      print("Error: GPTReponse failed.")
    return "Error: GPTReponse failed."

def main():
  print("Welcome to Planet-Talk ChatGPT!")
  if isTesting:
    print(getPlanetPersona(5, 3))
  print(getPlanetIntro(5))
  # while (True):
  #   message = input("User: ")
  #   GPTReponse(5, 3, message=message)

if __name__ == "__main__":
  main()
