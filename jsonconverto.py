import pandas as pd

def excel_to_json(excel_file, json_file):
    # Read Excel file into a pandas DataFrame
    df = pd.read_excel(excel_file)
    
    # Convert DataFrame to JSON and save it to a file
    df.to_json(json_file, orient='records')

# Example usage
excel_file = r'/home/siddhu_from_sklm/Desktop/TECKZITE/teckzitebackend/Users_Data.xlsx'
json_file = 'output.json'
excel_to_json(excel_file, json_file)
