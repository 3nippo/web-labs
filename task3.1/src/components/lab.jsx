import React, { useState } from 'react';

import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt';

import { red } from '@mui/material/colors';

import { 
  Table,
  TableContainer, 
  TableHead, 
  TableRow, 
  TableBody,
  TableCell,
  Paper, 
  IconButton, 
  Checkbox, 
  Grid, 
  TextField, 
  InputAdornment, 
  Button 
} from '@mui/material';

const useStylesTable = makeStyles( (theme) => ({
  root: {
    marginTop: 25,
    marginLeft: 100,
    marginRight: 100
  },
  row: {
    backgroundColor: red[600],
    "&:hover": {
      backgroundColor: red[600] + " !important"
    }
  }
}));

function OnChecked(checkboxValues, setCheckboxValues, idx, checked)
{
  const newCheckboxValues = checkboxValues.slice();

  newCheckboxValues[idx] = checked;

  setCheckboxValues(newCheckboxValues);
}

function OnAllChecked(checkboxValues, setCheckboxValues, checked)
{
  const newCheckboxValues = Array(checkboxValues.length).fill(checked);
  setCheckboxValues(newCheckboxValues);
}

function OnDelete(rows, setRows, checkboxValues)
{
  const newRows = rows.filter((value, idx) => !checkboxValues[idx]);

  setRows(newRows);
}

function MyTable(props) 
{
  const { rows, setRows, editRowCb, checkboxValues, setCheckboxValues, allChecked, setAllChecked, badRow, setBadRow } = props;

  const classes = useStylesTable();

  const MyTableCell = styled(TableCell)({
    fontSize: "1.2rem"
  });

  return (
    <TableContainer 
      component={ Paper }
      className={ classes.root }
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <MyTableCell>
              <IconButton
                onClick={ () => {
                  OnDelete(rows, setRows, checkboxValues);
                  
                  if (badRow !== -1 && checkboxValues[badRow])
                    setBadRow(-1);

                  setCheckboxValues(Array(rows.length).fill(false));
                  setAllChecked(false);
                }}
              >
                <span className="material-icons-outlined">
                  delete
                </span>
              </IconButton>
            </MyTableCell>
            
            <MyTableCell>
                <Checkbox
                  color='info'
                  checked={ allChecked }
                  onChange={ event => { 
                    OnAllChecked(checkboxValues, setCheckboxValues, event.target.checked);
                    setAllChecked(!allChecked);
                  }}
                />
            </MyTableCell>

            <MyTableCell>Index</MyTableCell>

            <MyTableCell>Dessert (100g serving)</MyTableCell>
            <MyTableCell align="right">Calories&nbsp;(ccal)</MyTableCell>
            <MyTableCell align="right">Fat&nbsp;(g)</MyTableCell>
            <MyTableCell align="right">Carbs&nbsp;(g)</MyTableCell>
            <MyTableCell align="right">Protein&nbsp;(g)</MyTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              className={ idx === badRow ? classes.row : "" }
              onClick={ event => { 
                OnChecked(checkboxValues, setCheckboxValues, idx, !checkboxValues[idx]);
                setAllChecked(false);
              }}
              hover
              key={ idx }
            >
              <MyTableCell>
                <IconButton 
                  onClick={ (event) => {
                    editRowCb(idx);
                    event.stopPropagation();
                  }}
                  style={{ marginLeft: "auto" }}
                >
                  <span className="material-icons-outlined">
                    edit
                  </span>
                </IconButton>
              </MyTableCell>

              <MyTableCell>
                <Checkbox
                  color='info'
                  checked={ checkboxValues[idx] }
                  onChange={ event => {
                    OnChecked(checkboxValues, setCheckboxValues, idx, event.target.checked);
                    setAllChecked(false);
                  }}
                >

                </Checkbox>
              </MyTableCell>

              <MyTableCell>{ idx }</MyTableCell>
              <MyTableCell scope="row" align="left">
                {row.dessert}
              </MyTableCell>
              <MyTableCell align="right">{row.ccals}</MyTableCell>
              <MyTableCell align="right">{row.fat}</MyTableCell>
              <MyTableCell align="right">{row.carbs}</MyTableCell>
              <MyTableCell align="right">{row.protein}</MyTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function EditRowCb(fields, keys, toEditState, rows, idx)
{
  toEditState[1](idx);
  
  const row = rows[idx];

  for (let i = 0; i < fields.length; ++i)
  {
    fields[i][1](row[keys[i]]);
  }
}

function AddRow(fields, rows, setRows, keys, toEditState, badRowState)
{
  for (let i = 0; i < fields.length; ++i)
  {
    if (fields[i][0] === "")
    {
      return;
    }
  }

  const newRows = rows.slice();

  const newRow = {};

  for (let i = 0; i < keys.length; ++i)
  {
    newRow[keys[i]] = fields[i][0];
  }

  const idx = rows.findIndex(elem => elem.dessert === newRow.dessert);

  if (toEditState[0] !== -1)
  {
    newRows[toEditState[0]] = newRow;
    toEditState[1](-1);
  }
  else if (idx !== -1)
  {
    badRowState[1](idx);
    return;
  }
  else
  {
    newRows.push(newRow);
  }

  setRows(newRows);
  
  badRowState[1](-1);

  for (let i = 0; i < fields.length; ++i)
  {
    fields[i][1]("");
  }
}

function GenOnChange(setter)
{
  return (event) => setter(event.target.value);
}

function OnChangeProtein(event, addCb, setCb)
{
  if (event.target.value.slice(-1) === '#')
    addCb();
  else
    setCb(event.target.value);
}

function OnDeleteByIndex(rows, setRows, idx)
{
  const newRows = rows.slice();

  newRows.splice(idx, 1);

  setRows(newRows);
}

const useStylesLab = makeStyles( (theme) => ({
  fields: {
    margin: 50
  },
  controls: {
    marginBottom: 20
  }
}));

function createData(dessert, ccals, fat, carbs, protein) {
  return {
    dessert: dessert,
    ccals: String(ccals),
    fat: String(fat),
    carbs: String(carbs),
    protein: String(protein),
  };
}

function removeTextAttrs(obj, parent, objKey)
{
  for (const [key, value] of Object.entries(obj))
  {
    if (parent && key === '_text')
    {
      parent[objKey] = obj[key];
      return;
    }

    removeTextAttrs(value, obj, key);
  }
}

function isFloat(value)
{
  return !isNaN(parseFloat(value));
}

function isFloatWrapper(setter)
{
  return value => {
    console.log(value);
    if (
      (isFloat(value) && (value.match(/\./g) || []).length < 2)
      || value === ""
    )
      setter(value);
  };
}

function callJQuery(rows, datatableKeys)
{
  $(document).ready(function() {
    $('#datatable').DataTable({
      data: rows,
      columns: datatableKeys,
      destroy: true,
      language: {
        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json"
      },
      initComplete: function () {
        this.api().columns().every( function () {
            var column = this;
            var select = $('<select><option value=""></option></select>')
                .appendTo( $(column.footer()).empty() )
                .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    column
                        .search( val ? '^'+val+'$' : '', true, false )
                        .draw();
                } );

            column.data().unique().sort().each( function ( d, j ) {
                select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
        } );
      }
    });
} );
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

export function Lab()
{
    const classes = useStylesLab()
    const tableClasses = useStylesTable()

    const keys = ["dessert", "ccals", "fat", "carbs", "protein"];

    const datatableKeys = keys.map(value => {
      return {"data": value, "title": value.capitalize()}
    })

    const defaultTable = [
      createData('Cupcake', 305, 3.7, 67, 4.3),
      createData('Donut', 452, 25.0, 51, 4.9),
      createData('Eclair', 262, 16.0, 24, 6.0),
      createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
      createData('Gingerbread', 356, 16.0, 49, 3.9)
    ];

    const [ show, setShow ] = useState(false);

    const convert = require('xml-js');
    const options = {
      compact: true, 
      spaces: 4,
      //nativeType: true
    };

    const [ rows, setRows_ ] = useState([]);

    const setRows = (rows) => {
      const xml = convert.js2xml({"table": {"row" : rows}}, options);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:1961/?accessor=lab03');
      xhr.send(xml);

      setRows_(rows);

      callJQuery(rows, datatableKeys);
    };

    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:1961/?accessor=lab03');

    xhr.onload = () => {
      if (xhr.status === 204)
      {
        setRows(defaultTable);
        setShow(true);
        return;
      }

      if (xhr.status !== 200)
        return;

      const obj = convert.xml2js(xhr.response, options).table.row || [];
      removeTextAttrs(obj);

      setShow(true);
      setRows(obj)
    };

    if (!show)
      xhr.send();

    const [ dessert, setDessert ] = useState("");
    const [ ccals, setCcals_ ] = useState("");
    const [ protein, setProtein_ ] = useState("");
    const [ fat, setFat_ ] = useState("");
    const [ carbs, setCarbs_ ] = useState("");

    const setCcals = isFloatWrapper(setCcals_),
          setProtein = isFloatWrapper(setProtein_),
          setFat = isFloatWrapper(setFat_),
          setCarbs = isFloatWrapper(setCarbs_);

    const fields = [
      [ dessert, setDessert ],
      [ ccals, setCcals ],
      [ fat, setFat ],
      [ carbs, setCarbs ],
      [ protein, setProtein ]
    ];

    const toEditState = useState(-1);

    const [ checkboxValues, setCheckboxValues ] = useState(Array(rows.length).fill(false));

    const [ allChecked, setAllChecked ] = useState(false);

    const badRowState = useState(-1);

    return (
      <Grid
        justifyContent="space-around"
        container
      >
        <Grid
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            className={ classes.fields }
            container
        >
          <TextField 
            label="Dessert" 
            id="Dessert" 
            variant="outlined"
            value={ dessert }
            className={ classes.label }
            onChange={ GenOnChange(setDessert) }
          />

          <TextField 
            label="Calories" 
            id="Calories" 
            variant="outlined" 
            value={ ccals }
            className={ classes.label }
            onChange={ GenOnChange(setCcals) }
          />

          <TextField 
            label="Fat" 
            id="Fat" 
            variant="outlined" 
            value={ fat }
            className={ classes.label }
            onChange={ GenOnChange(setFat) }
          />

          <TextField 
            label="Carbs" 
            id="Carbs" 
            variant="outlined" 
            value={ carbs }
            className={ classes.label }
            onChange={ GenOnChange(setCarbs) }
          />

          <TextField 
            label="Protein" 
            id="Protein" 
            variant="outlined" 
            value={ protein }
            className={ classes.label }
            onChange={ (event) => OnChangeProtein(
              event, () => { 
                AddRow(fields, rows, setRows, keys, toEditState, badRowState);
                setCheckboxValues(Array(rows.length).fill(false));
                setAllChecked(false);
              }, 
              setProtein
            )}
          />
        </Grid>
        <Grid
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          className={ classes.controls }
          container
        >
          <TextField
            label="Index"
            id="Index"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="material-icons-outlined">
                    delete
                  </span>
                </InputAdornment>
              ),
            }}
            onChange={ event => {
              if (isNaN(event.target.value.slice(-1)))
              {
                event.target.value = event.target.value.slice(0, -1);
              }
            }}
            onKeyDown={ event => {
              if (event.keyCode !== 13)
                return;
              
              const idx = parseInt(event.target.value);

              if (
                isNaN(idx)
                || idx <= -1
                || idx >= rows.length
              )
                return;

              document.getElementById("Index").value = "";
              
              OnDeleteByIndex(rows, setRows, idx);

              if (idx === badRowState[0])
                badRowState[1](-1);
            }}
            variant="outlined"
          />
          <Button 
            variant="outlined"
            size="large"
            onClick={ () => {
              setRows(defaultTable);
              setCheckboxValues(Array(rows.length).fill(false));
              setAllChecked(false);
            }}
          >
            Reset
          </Button>
        </Grid>
        {
          show ?
          <>
            <MyTable
              rows={ rows }
              setRows={ setRows }
              editRowCb={ (idx) => { EditRowCb(fields, keys, toEditState, rows, idx) }}
              checkboxValues={ checkboxValues } 
              setCheckboxValues={ setCheckboxValues }
              allChecked={ allChecked } 
              setAllChecked={ setAllChecked }
              badRow={ badRowState[0] }
              setBadRow={ badRowState[1] }
            />
            <div style={{"margin": "50px", "width": "100%"}}>
              <table id="datatable" className="display" style={{"width": "100%"}}>
                <tfoot>
                  <tr>
                    { keys.map((v, idx) => <th key={idx}></th>) }
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
          : null
        }
      </Grid>
    );
}