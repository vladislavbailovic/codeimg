CLI text-to-image Converter
===========================

Consists of two commands - code-to-image (`c2i`) and markdown-to-image (`m2i`).


Code to image (c2i)
-------------------

  Converts textual code to an image


Markdown to image (m2i)
-----------------------

  Converts markdown to HTML, to an image
  

Subcommands
-----------

  --command (optional)   Subcommand - one of help, ls, lf or serve
  

Options
-------

  -i, --input string    Input file containing code  
  -p, --port number     Port used to serve rendered markup - default 8281  
  -s, --style string    Stylesheet to use  
  -f, --font string     Font to use  
  -o, --output string   Output file - use dash for stdout, dot to just append png. Default is clipboard (which requires `xclip`)  
  -b, --base64          Base64-encode stdout  
  -h, --help            Show this help  

