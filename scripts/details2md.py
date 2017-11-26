from csv import reader, writer
from codecs import open
from sys import argv, stderr

fn_template = "{Service ID}"
md_template = """
# <span style="color:{Colour RGB};">({Service ID})</span> {Service Name}

## Enquiries Contact
| Phone | Email |
| ----- | ----- |
| {Enquiries Contact - phone} | {Enquiries Contact - email} |

## Links

- [Website]({Website})
- [CM Listing Link]({CM Listing Link})

## More info
| Caseload (e.g. adults/children) | Service |
| ------------------------------- | ------- |
| {Caseload eg adults/children} | {Service} |


## Notes

{Notes}
"""

if __name__ == '__main__':
  # usage: <csvtworow-file> <dist>
  # csvtworow as first argument
  # distcsv as second
  if len(argv) != 3:
    print("Usage: {0} <detailscsvfile> <distdir>".format(argv[0]), file=stderr)
    exit(-1)
  with open(argv[1], 'r') as f:
    inputrows = list(reader(f))
    if len(inputrows) < 2:
      raise ValueError("Expecting more than one row in input file")
    fields = list(map(lambda a: a.replace("(", "").replace(")", "").replace(".", ""), inputrows[0]))
    rows = []
    for inputrow in inputrows[1:]:
      row = {}
      for i in range(len(fields)):
        row[fields[i]] = inputrow[i] if len(inputrow) > i else ""
      rows.append(row)
    for row in rows:
      with open("{0}/aac-{1}.md".format(argv[2], fn_template.format(**row).lower()), 'w') as wf:
        wf.write(md_template.format(**row))
    
