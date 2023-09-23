# read api key file
keys = {}
with open('key.private', 'r') as f:
    # read in each row as a list, and split each row by colon
    for row in f:
      row = row.strip().split(':')
      # add key to dict
      keys[row[0]] = row[1]

for key in keys:
    print(key, keys[key])