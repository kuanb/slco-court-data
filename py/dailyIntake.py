import json
import ftplib
import csv

with open('./credentials.json') as data_file:    
	data = json.load(data_file)

#Open ftp connection
ftp = ftplib.FTP(
	data['ftp']['host'],
	data['ftp']['user'],
	data['ftp']['pass'],
)

def parse(s):
	reader = csv.reader(s, delimiter='\t')
	for row in reader:
		print(row)
	

ftp.retrlines('RETR ./incoming/vine_case.ul', parse)



