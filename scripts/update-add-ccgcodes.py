import csv
from codecs import open
from sys import argv, stderr

with open('../add.md', 'r') as myfile:
    md_template=myfile.read()

ccg_data = 'html/data/service-aac-ccg.csv'
#CCG17CDH,CCG17NM
ccg_html = ''

if __name__ == '__main__':
  # usage: <csvtworow-file> <dist>
  # csvtworow as first argument
  # distcsv as second
  with open(ccg_data) as csvfile:
    ccgreader = csv.reader(csvfile)
    for row in ccgreader:
        ccg_html = ccg_html + '<option value="'+row[2]+'">'+row[3]+'</option>'

    with open('../add.md', 'w') as wf:
        wf.write(md_template.format(ccg_html))
