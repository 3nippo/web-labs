import React from 'react';
import ReactDOM from 'react-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import { descriptionWidth, Description } from './components/description'
import { Lab } from './components/lab'

const theme = createTheme({
  palette: {
    //mode: "dark"
  }
});

const description = (
  <>
    Задание:

    <ol>
      <li>Формат хранения 11 % 3 = 2 <span>&#10233;</span> XML формат</li>
      <li>Дополнительно: 11 % 17 = 11 <span>&#10233;</span> language file</li>
      <li>Дополнительно: 11 % 9 = 2 <span>&#10233;</span> поиск по столбцу по значению</li>
    </ol>

  </>
);

ReactDOM.render(
  <>
    <ThemeProvider theme={ theme }>
      <CssBaseline/>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{ width: descriptionWidth, flexShrink: 0 }}
        >
          <Description 
            variant="11"
            description={ description }
          />
        </Box>
        <Lab />
      </Box>
    </ThemeProvider>
  </>
  ,
  document.getElementById("root")
);
