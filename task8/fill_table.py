import mysql.connector
from getpass import getpass
import json
import os


def dprint(*args, **kwargs):
    if 'DEBUG' in os.environ:
        print(*args, **kwargs)


def read_rows(filename):
    rows = None

    with open(filename, 'r') as f:
        rows = json.load(f)
        dprint(rows[:3])
    
    rows = [d['Cells'] for d in rows]

    return rows


def table_exists(cnx, table_name):
    cursor = cnx.cursor()

    cursor.execute(
        "SHOW TABLES LIKE %s",
        (table_name,)
    )

    exists_response = cursor.fetchone()

    cursor.close()

    return exists_response != None


def clear_table_if_exists(cnx, table_name):
    if not table_exists(cnx, table_name):
        return

    cursor = cnx.cursor()

    cursor.execute(
        "DELETE FROM {}".format(table_name)
    )

    cnx.commit()

    cursor.close()

def write_rows_to_db(cnx, rows, columns):
    clear_table_if_exists(cnx, 'clinics')

    query_columns = ",".join(columns.keys())
    query_values = ",".join(['%s'] * len(columns.keys()))

    query_fmt = 'INSERT INTO clinics ({}) VALUES ({})'.format(
        query_columns, 
        query_values
    )

    dprint(query_fmt)
    
    cursor = cnx.cursor()

    for row in rows:
        query_data = []

        for _, fr in columns.items():
            value = ""

            if fr == 'WorkingHours':
                for working_hour in row[fr]:
                    value += '{}: {}\t'.format(
                        working_hour["DayOfWeek"],
                        working_hour["Hours"]
                    )

            elif fr == 'PublicPhone':
                for public_phone in row[fr]:
                    value += '+7 {}\t'.format(public_phone["PublicPhone"])

            else:
                value = str(row[fr])

            query_data.append(value)
        
        cursor.execute(query_fmt, query_data)
    
    cnx.commit()

    cursor.close()


def write_titles_to_db(cnx, titles):
    clear_table_if_exists(cnx, 'clinics_info')

    cursor = cnx.cursor()

    cursor.execute(
        "INSERT INTO clinics_info (titles) VALUES (%s)",
        (json.dumps(titles, indent=4),)
    )

    cnx.commit()

    cursor.close()


def main():
    rows = read_rows('rows.json')

    cnx = mysql.connector.connect(
        user='root', 
        password=getpass(),
        database='vet_clinics'
    )
    
    write_rows_to_db(
        cnx,
        rows,
        {
            "full_name": "FullName",
            "short_name": "ShortName",
            "inn": "INN",
            "adm_area": "AdmArea",
            "district": "District",
            "address": "Address",
            "public_phone": "PublicPhone",
            "working_hours":"WorkingHours"
        }
    )
    
    write_titles_to_db(
        cnx,
        [
            "Полное наименование",
            "Сокращенное наименование",
            "ИНН",
            "Административный округ по адресу",
            "Район",
            "Адрес",
            "Контактный телефон",
            "График работы"
        ]
    )

    cnx.close()


if __name__ == '__main__':
    main()
