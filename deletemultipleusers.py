import requests

base_url = 'http://localhost:4000/user/delete/'

for i in range(202, 236):
    user_id = f'tzk241{i:03d}'
    delete_url = base_url + user_id
    response = requests.delete(delete_url)
    if response.status_code == 200:
        print(f"User {user_id} deleted successfully")
    else:
        print(f"Failed to delete user {user_id}. Status code: {response.status_code}")
