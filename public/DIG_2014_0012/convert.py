import csv

def convert_txt_to_csv(txt_file, csv_file, delimiter='\t'):
    # Open the input .txt file and output .csv file
    with open(txt_file, 'r', newline='', encoding='ISO-8859-1') as infile, open(csv_file, 'w', newline='', encoding='utf-8') as outfile:
        # Initialize the CSV reader and writer
        reader = csv.reader(infile, delimiter=delimiter)
        writer = csv.writer(outfile)

        # Copy each row from .txt to .csv
        for row in reader:
            writer.writerow(row)

# Convert Boreholes.txt to Boreholes.csv
convert_txt_to_csv('Boreholes.txt', 'Boreholes.csv')

# Similarly, convert Intervals.txt and Sources.txt to CSV
convert_txt_to_csv('Intervals.txt', 'Intervals.csv')
convert_txt_to_csv('Sources.txt', 'Sources.csv')
