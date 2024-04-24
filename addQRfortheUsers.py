import requests
import json

# URL of your server
url = 'http://localhost:4000/qr/users'

# Path to the JSON file containing user data
json_file_path = '/home/siddhu_from_sklm/Desktop/TECKZITE/teckzitebackend/output.json'

# Read user data from the JSON file
with open(json_file_path, 'r') as file:
    users_data = json.load(file)

# Send POST requests to add users
for user_data in users_data:
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=user_data, headers=headers)
    
    # Check if the request was successful
    if response.status_code == 201:
        print(f"User added successfully: {user_data}")
    else:
        print(f"Failed to add user: {user_data}")
        print(f"Response: {response.text}")
