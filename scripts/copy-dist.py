from __future__ import print_function
import os
from sys import argv, stderr
from os import environ
from codecs import open
from distutils.dir_util import mkpath, copy_tree
from distutils.file_util import copy_file
# usage: $0 basedir htmlfile distdatadir [mainjsdist [maincssdist]]
# detect matches
# replace matches
# copy assets if have match

if len(argv) < 3:
  print("usage: {0} distdir disthtmlfile [datadirdist [mainjsdist [maincssdist]]]"
        .format(argv[0]), file=stderr)
  exit(1)

html_dir = environ['HTML_DIR'] if 'HTML_DIR' in environ else \
           os.path.join(os.path.dirname(os.path.dirname(
             os.path.realpath(__file__))), "html")

dist_dir = argv[1]
dist_html_file = argv[2]
dist_data_dir = argv[3] if len(argv) > 3 else \
                (environ['DATA_DIR'] if 'DATA_DIR' in environ else "data")
dist_main_js = argv[4] if len(argv) > 4 else "js/main.js"
dist_main_css = argv[5] if len(argv) > 5 else "css/main.css"

replacement_needle = "__CCG_LOOKUP__"

# write html
print("Write html")
with open(os.path.join(dist_dir, dist_html_file), 'r+', encoding='utf-8') as f:
  data = "".join(iter(f.read, ''))
  if data.find(replacement_needle) == -1:
    print("Not found")
    exit(0)
  with open(os.path.join(html_dir, "index-dist.html"), 'r',
            encoding='utf-8') as hf:
    dist_html = "".join(iter(hf.read, ''))
    kwargs = {
      'main_js': dist_main_js,
      'main_css': dist_main_css
    }
    dist_html = dist_html.format(**kwargs)
    data = data.replace(replacement_needle, dist_html)
    f.seek(0)
    f.write(data)
    f.truncate()

print("copy data")
copy_tree(os.path.join(html_dir, "data"),
          os.path.join(dist_dir, dist_data_dir))

print("copy main.js")
mkpath(os.path.join(dist_dir, os.path.dirname(dist_main_js)))
copy_file(os.path.join(html_dir, "js/main.js"),
          os.path.join(dist_dir, dist_main_js))

print("copy main.css")
mkpath(os.path.join(dist_dir, os.path.dirname(dist_main_css)))
copy_file(os.path.join(html_dir, "css/main.css"),
          os.path.join(dist_dir, dist_main_css))
