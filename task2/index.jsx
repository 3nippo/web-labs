const descriptionWidth = 400;

const useStyles = MaterialUI.makeStyles( (theme) => ({
  actions: {
    padding: 0,
    marginTop: -17
  },
  cardHeader: {
    paddingBottom: 0
  },
  card: {
    maxWidth: descriptionWidth
  },
  cardContent: {
    overflowWrap: "anywhere",
    hyphens: "auto"
  },
  div: {
    "& .MuiPaper-root": {
      backgroundColor: "transparent"
    },
    "& .MuiDrawer-paperAnchorDockedLeft": {
      borderRight: 0
    }
  }
}));

function Description(props)
{
    const { variant, description } = props;

    const Avatar = MaterialUI.styled(MaterialUI.Avatar)({
        width: 56,
        height: 56
    });

    const [expanded, setExpanded] = React.useState(false);

    const classes = useStyles();

    return (
      <div className={ classes.div }>
        <MaterialUI.Drawer 
            elevation={0} 
            variant="permanent"
            open
        >
          <MaterialUI.Card 
            className={ classes.card }
            variant="outlined"
          >
            
            <MaterialUI.CardHeader
              avatar={
                <Avatar 
                  alt="Ilya Mazin pic" 
                  src="https://lh3.googleusercontent.com/ogw/ADea4I6XNuW4234Jki8A-Jhj0eceu9KczmhXBF-0BEbc=s192-c-mo"
                />
              }
              titleTypographyProps={{ variant:'h5' }}
              title="Ilya Mazin"
              subheader={
                <>
                    Group: M8O-106M-21<br/>
                    Variant: { variant }
                </>
              }
              className={ classes.cardHeader }
            />

            <MaterialUI.Collapse in={expanded}>
              
              <MaterialUI.CardContent className={ classes.cardContent }>
                <MaterialUI.Typography>
                  { description }
                </MaterialUI.Typography>
              </MaterialUI.CardContent>

            </MaterialUI.Collapse>

            <MaterialUI.CardActions disableSpacing className={ classes.actions }>
              <MaterialUI.IconButton 
                onClick={() => { setExpanded(!expanded) }}
                style={{ marginLeft: "auto" }}
              >
                <span class="material-icons">info_outline</span>
              </MaterialUI.IconButton>
            </MaterialUI.CardActions>

          </MaterialUI.Card>
        </MaterialUI.Drawer>
      </div>
    );
}

const theme = MaterialUI.createTheme({
  palette: {
    type: "dark"
  },
});

const description = (
  <>
    Справочник должен:

    <ol>
      <li>11 % 2 = 1 <span>&#10233;</span> отображаться в виде нумерованного списка</li>
      <li>(11 % 3) + 3 = 5 <span>&#10233;</span> содержать 5 полей. Первое поле ключевое</li>
      <li>11 % 4 = 3 <span>&#10233;</span> добавление элемента справочника при вводе # в конце всех значений</li>
      <li>((11 + 1) % 3) + 1 = 1 <span>&#10233;</span> позволять удалять отдельные элементы по номеру строки</li>
      <li>позволять изменять отдельные элементы</li>
    </ol>

  </>
);

const useStylesTable = MaterialUI.makeStyles( (theme) => ({
  root: {
    marginTop: 25,
    marginLeft: 100,
    marginRight: 100
  },
  row: {
    backgroundColor: MaterialUI.colors.red[600],
    "&:hover": {
      backgroundColor: MaterialUI.colors.red[600] + " !important"
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

function Table(props) 
{
  const { rows, setRows, editRowCb, checkboxValues, setCheckboxValues, allChecked, setAllChecked, badRow, setBadRow } = props;

  const classes = useStylesTable();

  const TableCell = MaterialUI.styled(MaterialUI.TableCell)({
    fontSize: "1.2rem"
  });

  return (
    <MaterialUI.TableContainer 
      component={ MaterialUI.Paper }
      className={ classes.root }
    >
      <MaterialUI.Table sx={{ minWidth: 650 }} aria-label="simple table">
        <MaterialUI.TableHead>
          <MaterialUI.TableRow>
            <TableCell>
              <MaterialUI.IconButton
                onClick={ () => {
                  OnDelete(rows, setRows, checkboxValues);
                  
                  if (badRow !== -1 && checkboxValues[badRow])
                    setBadRow(-1);

                  setCheckboxValues(Array(rows.length).fill(false));
                  setAllChecked(false);
                }}
              >
                <span class="material-icons-outlined">
                  delete
                </span>
              </MaterialUI.IconButton>
            </TableCell>
            
            <TableCell>
                <MaterialUI.Checkbox
                  color='info'
                  checked={ allChecked }
                  onChange={ event => { 
                    OnAllChecked(checkboxValues, setCheckboxValues, event.target.checked);
                    setAllChecked(!allChecked);
                  }}
                />
            </TableCell>

            <TableCell>Index</TableCell>

            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories&nbsp;(ccal)</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </MaterialUI.TableRow>
        </MaterialUI.TableHead>
        <MaterialUI.TableBody>
          {rows.map((row, idx) => (
            <MaterialUI.TableRow
              className={ idx === badRow ? classes.row : "" }
              onClick={ event => { 
                OnChecked(checkboxValues, setCheckboxValues, idx, !checkboxValues[idx]);
                setAllChecked(false);
              }}
              hover
            >
              <TableCell>
                <MaterialUI.IconButton 
                  onClick={ (event) => {
                    editRowCb(idx);
                    event.stopPropagation();
                  }}
                  style={{ marginLeft: "auto" }}
                >
                  <span class="material-icons-outlined">
                    edit
                  </span>
                </MaterialUI.IconButton>
              </TableCell>

              <TableCell>
                <MaterialUI.Checkbox
                  color='info'
                  checked={ checkboxValues[idx] }
                  onChange={ event => {
                    OnChecked(checkboxValues, setCheckboxValues, idx, event.target.checked);
                    setAllChecked(false);
                  }}
                >

                </MaterialUI.Checkbox>
              </TableCell>

              <TableCell>{ idx }</TableCell>
              <TableCell scope="row" align="left">
                {row.dessert}
              </TableCell>
              <TableCell align="right">{row.ccals}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </MaterialUI.TableRow>
          ))}
        </MaterialUI.TableBody>
      </MaterialUI.Table>
    </MaterialUI.TableContainer>
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

function createData(dessert, ccals, fat, carbs, protein) {
  return {
    dessert,
    ccals,
    fat,
    carbs,
    protein,
  };
}

function OnDeleteByIndex(rows, setRows, idx)
{
  const newRows = rows.slice();

  newRows.splice(idx, 1);

  setRows(newRows);
}

const useStylesLab = MaterialUI.makeStyles( (theme) => ({
  fields: {
    margin: 50
  },
  controls: {
    marginBottom: 20
  }
}));

function Lab()
{
    const classes = useStylesLab()

    const defaultTable = [
      createData('Cupcake', 305, 3.7, 67, 4.3),
      createData('Donut', 452, 25.0, 51, 4.9),
      createData('Eclair', 262, 16.0, 24, 6.0),
      createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
      createData('Gingerbread', 356, 16.0, 49, 3.9)
    ];

    let table = JSON.parse(localStorage.getItem('table')) || defaultTable;

    const [ rows, setRows_ ] = React.useState(table);

    const setRows = (rows) => {
      localStorage.setItem('table', JSON.stringify(rows));
      setRows_(rows);
    };

    const [ dessert, setDessert ] = React.useState("");
    const [ ccals, setCcals ] = React.useState("");
    const [ protein, setProtein ] = React.useState("");
    const [ fat, setFat ] = React.useState("");
    const [ carbs, setCarbs ] = React.useState("");

    const fields = [
      [ dessert, setDessert ],
      [ ccals, setCcals ],
      [ fat, setFat ],
      [ carbs, setCarbs ],
      [ protein, setProtein ]
    ];

    const keys = ["dessert", "ccals", "fat", "carbs", "protein"];

    const toEditState = React.useState(-1);

    const [ checkboxValues, setCheckboxValues ] = React.useState(Array(rows.length).fill(false));

    const [ allChecked, setAllChecked ] = React.useState(false);

    const badRowState = React.useState(-1);

    return (
      <MaterialUI.Grid
        justifyContent="space-around"
        container
      >
        <MaterialUI.Grid
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            className={ classes.fields }
            container
        >
          <MaterialUI.TextField 
            label="Dessert" 
            id="Dessert" 
            variant="outlined"
            value={ dessert }
            className={ classes.label }
            onChange={ GenOnChange(setDessert) }
          />

          <MaterialUI.TextField 
            label="Calories" 
            id="Calories" 
            variant="outlined" 
            value={ ccals }
            className={ classes.label }
            onChange={ GenOnChange(setCcals) }
          />

          <MaterialUI.TextField 
            label="Fat" 
            id="Fat" 
            variant="outlined" 
            value={ fat }
            className={ classes.label }
            onChange={ GenOnChange(setFat) }
          />

          <MaterialUI.TextField 
            label="Carbs" 
            id="Carbs" 
            variant="outlined" 
            value={ carbs }
            className={ classes.label }
            onChange={ GenOnChange(setCarbs) }
          />

          <MaterialUI.TextField 
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
        </MaterialUI.Grid>
        <MaterialUI.Grid
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          className={ classes.controls }
          container
        >
          <MaterialUI.TextField
            label="Index"
            id="Index"
            InputProps={{
              startAdornment: (
                <MaterialUI.InputAdornment position="start">
                  <span class="material-icons-outlined">
                    delete
                  </span>
                </MaterialUI.InputAdornment>
              ),
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
          <MaterialUI.Button 
            variant="outlined"
            size="large"
            onClick={ () => {
              setRows(defaultTable);
              setCheckboxValues(Array(rows.length).fill(false));
              setAllChecked(false);
            }}
          >
            Reset
          </MaterialUI.Button>
        </MaterialUI.Grid>
        <Table
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
      </MaterialUI.Grid>
    );
}

ReactDOM.render(
    <>
      <MaterialUI.ThemeProvider theme={ theme }>
        <MaterialUI.CssBaseline/>
        <MaterialUI.Box sx={{ display: "flex" }}>
          <MaterialUI.Box
            sx={{ width: descriptionWidth, flexShrink: 0 }}
          >
            <Description 
              variant="11"
              description={ description }
            />
          </MaterialUI.Box>
          <Lab />
        </MaterialUI.Box>
      </MaterialUI.ThemeProvider>
    </>
    ,
    document.getElementById("root")
);