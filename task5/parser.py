import sys
import lxml.etree as ET

if len(sys.argv) == 3:
    _, xml, xslt = sys.argv
else:
    print("Wrong inputs!")
    exit(1)

dom = ET.parse(xml)
xslt = ET.parse(xslt)
transform = ET.XSLT(xslt)
newdom = transform(dom)

transformed = ET.tostring(newdom, encoding='utf-8')

print(transformed.decode())
