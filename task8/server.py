from flask import Flask, request, make_response
import json
import mysql.connector
from getpass import getpass
import re
import itertools
from pprint import pprint


app = Flask(__name__)

cnx = mysql.connector.connect(
    user='root', 
    password=getpass(),
    database='vet_clinics'
)

columns = None


def query_columns():
    cursor = cnx.cursor()

    cursor.execute("SELECT * FROM clinics ORDER BY id LIMIT 0")

    cursor.fetchone()

    columns = cursor.column_names

    cursor.close()

    return columns


columns = query_columns()


@app.route("/", methods=['OPTIONS'])
def preflight():
    response = make_response()

    response.access_control_allow_origin = '*'
    response.access_control_allow_methods = '*'

    print('preflight')

    return response


def page_query(columns, length, offset, search_value, order_by, asc):
    cursor = cnx.cursor()
    
    where_fmt = "WHERE " + " OR ".join(["LOWER({}) LIKE %s".format(column) for column in columns[1:]])

    query = "SELECT * FROM clinics {} ORDER BY {} {} LIMIT {} OFFSET {}".format(
        where_fmt if search_value else '',
        order_by,
        asc.upper(),
        length, 
        offset,
    )

    cursor.execute(
        query, 
        ['%' + search_value.lower() + '%'] * (len(columns) - 1) if search_value else []
    )

    rows = cursor.fetchall()

    cursor.close()
    
    return rows


def rows_to_data(rows, columns):
    data = []

    for row in rows:
        row_data = { column: row[i]  for i, column in enumerate(columns) }

        data.append(row_data)

    return data


def get_titles():
    cursor = cnx.cursor()

    cursor.execute("SELECT titles FROM clinics_info")

    titles = cursor.fetchone()[0]

    cursor.close()

    return titles


def parse_DataTables_row(row):
    column_parser = re.compile("\w+\[\d+\]\[(\w+)\]")

    parsed_row = {}

    for column, value in row.items():
        parser_result = column_parser.findall(column)

        if not parser_result:
            continue

        column = parser_result[0]

        parsed_row[column] = value

    return parsed_row


def delete_row(row):
    cursor = cnx.cursor()

    cursor.execute(
        "DELETE FROM clinics WHERE id = %s",
        (row["id"],)
    )

    cnx.commit()

    cursor.close()


def update_row(columns, row, row_id):
    cursor = cnx.cursor()
    
    query_set = ",".join(
        ["{} = %s".format(column) for column in columns[1:]]
    )

    query_set_values = [row[column] for column in columns[1:]]
    
    cursor.execute(
        "UPDATE clinics SET {} WHERE id = %s".format(query_set),
        query_set_values + [row_id]
    )

    cnx.commit()

    cursor.close()


def add_row(columns, row):
    cursor = cnx.cursor()
    
    query_values_fmt = ",".join(['%s'] * (len(columns) - 1))
    query_values = [row[column] for column in columns[1:]]

    cursor.execute(
        "INSERT INTO clinics ({}) VALUES ({})".format(
            ",".join(columns[1:]),
            query_values_fmt
        ),
        query_values
    )

    cnx.commit()

    cursor.close()


def get_total_count():
    cursor = cnx.cursor()

    cursor.execute("SELECT COUNT(*) FROM clinics")

    total = cursor.fetchone()[0]

    cursor.close()

    return total


def get_filtered_count(columns, search_value):
    if not search_value:
        return get_total_count()

    cursor = cnx.cursor()
    
    where_fmt = "WHERE " + " OR ".join(["LOWER({}) LIKE %s".format(column) for column in columns[1:]])

    query = "SELECT COUNT(*) FROM clinics {}".format(
        where_fmt
    )

    cursor.execute(
        query, 
        ['%' + search_value.lower() + '%'] * (len(columns) - 1)
    )

    rows = cursor.fetchone()[0]

    cursor.close()
    
    return rows


def get_response(columns, args):
    rows = page_query(
        columns, 
        args['length'], 
        args['start'],
        args['search[value]'],
        columns[int(args['order[0][column]'])],
        args['order[0][dir]']
    )

    page_obj = {
        "data": rows_to_data(rows, columns),
        "recordsTotal": get_total_count(),
        "recordsFiltered": get_filtered_count(columns, args['search[value]'])
    }

    return page_obj


@app.route("/", methods=['GET', 'POST', 'PUT', 'DELETE'])
def table_storage():
    accessor = request.args.get('accessor')

    print("accessor is {}".format(accessor))
    
    content = ""
    rc = 200

    if accessor != 'lab08':
        content = "<h1>вы кто такие? я вас не звал</h1>"
    
    elif request.method == 'GET':
        if 'titles' in request.args:
            content = get_titles()
        elif 'columns' in request.args:
            content = json.dumps(columns[1:], indent=4)
        else:
            content = json.dumps(get_response(columns, request.args), indent=4)
    
    elif request.method == 'DELETE':
        row_to_delete = parse_DataTables_row(request.args)
        delete_row(row_to_delete)
        rc = 204
    elif request.method == 'PUT':
        updated_row = parse_DataTables_row(request.form)
        row_id = request.args.get('id')
        update_row(columns, updated_row, row_id)

        response = {
            "data": [
                updated_row
            ]
        }
        content = json.dumps(response, indent=4)
    elif request.method == 'POST':
        new_row = parse_DataTables_row(request.form)
        add_row(columns, new_row)

        response = {
            "data": [
                new_row
            ]
        }
        content = json.dumps(response, indent=4)
    else:
        content = "Not implemented method: {}".format(request.method)
        print(content)

    response = make_response((content, rc))
    
    response.access_control_allow_origin = '*'

    return response


if __name__ == '__main__':
    try:
        app.run(port=1961)
    except KeyboardInterrupt:
        cnx.close()
