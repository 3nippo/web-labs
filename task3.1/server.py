from flask import Flask, request, make_response
from pathlib import Path

app = Flask(__name__)

filename = 'table.xml'
    

def load_table():
    if not Path(filename).is_file():
        return "", 204

    with open(filename, 'r') as f:
        return f.read(), 200


def save_table(content):
    with open(filename, 'w') as f:
        f.write(content)


@app.route("/", methods=['GET', 'POST'])
def table_storage():
    print("accessor is {}".format(request.args.get('accessor')))
    
    content = ""
    rc = 200

    if request.args.get('accessor') != 'lab03':
        content = "<h1>вы кто такие? я вас не звал</h1>"
    
    elif request.method == 'GET':
        print("Returned data")
        content, rc = load_table()

    elif request.method == 'POST':
        print("Saved data")
        save_table(request.get_data(as_text=True))

    response = make_response((content, rc))
    
    response.access_control_allow_origin = '*'

    return response


if __name__ == '__main__':
    app.run(port=1961)
