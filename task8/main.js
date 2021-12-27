var editor; // use a global for the submit and return data rendering in the examples

var pageIdx = 0;

function createDataTable(columns, fields)
{
  editor = new $.fn.dataTable.Editor( {
    ajax: {
      create: {
        type: 'POST',
        url:  'http://127.0.0.1:1961/?accessor=lab08'
      },
      edit: {
        type: 'PUT',
        url:  'http://127.0.0.1:1961/?accessor=lab08&id={id}',
      },
      remove: {
        type: 'DELETE',
        url:  'http://127.0.0.1:1961/?accessor=lab08'
      }
    },
    table: "#table",
    fields: fields,
    idSrc: "id"
  } );
 
  $('#table').DataTable( {
    processing: true,
    serverSide: true,
    search: {
      return: true
    },
    dom: "Bfrtip",
    pagingType: "simple",
    ajax: "http://127.0.0.1:1961/?accessor=lab08",
    columns: columns,
    select: true,
    buttons: [
        { extend: "create", editor: editor },
        { extend: "edit",   editor: editor },
        { extend: "remove", editor: editor }
    ]
  } );
}

function extractDataTablesColumns(columns, titles)
{
  let dataTablesColumns = []

  for (const [i, column] of columns.entries())
  {
    const title = titles[i]

    dataTablesColumns.push({
      title: title,
      data: column,
      render: data => data.replaceAll("\t", "<br />"),
      width: "300px"
    })
  }

  return dataTablesColumns
}

function extractDataTablesEditColumns(columns, titles)
{
  let dataTablesColumns = []

  for (const [i, column] of columns.entries())
  {
    const title = titles[i]

    dataTablesColumns.push({
      label: `${title}:`,
      name: column
    })
  }

  return dataTablesColumns
}

$(document).ready(function() {
  $.get(
    "http://127.0.0.1:1961/?accessor=lab08&columns",
    columns => {
      $.get(
        "http://127.0.0.1:1961/?accessor=lab08&titles",
        titles => {
          columns = JSON.parse(columns)
          titles = JSON.parse(titles)

          const columnsInfo = extractDataTablesColumns(columns, titles)

          const editColumnsInfo = extractDataTablesEditColumns(columns, titles)
          
          createDataTable(columnsInfo, editColumnsInfo)
        }
      )
    }
  )
  
} );