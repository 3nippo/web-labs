import React, { useState } from 'react';

import { makeStyles } from '@mui/styles';

import { Drawer, Card, CardHeader, Collapse, CardContent, Typography, CardActions, IconButton, Avatar } from '@mui/material';

export const descriptionWidth = 400;

// function FunctionalComponent(props) {
//   const [greetings, setGreetings] = useState("");

//   setGreetings(`Hey, you. You're finally awake. ${props.anotherReference}`);

//   return <h1>{greetings}</h1>;
// }

// class ClassComponent extends React.Component {
//   constructor(props)
//   {
//     super(props);
//     this.state = {
//       greetings: ""
//     };
//   }
  
//   render() {
    
//     this.setState({
//       greetings: `Hey, you. You're finally awake. ${props.anotherReference}`
//     });

//     return <h1>{this.state.greetings}</h1>;
//   }
// }

// const composition = <>
//   <FunctionalComponent 
//     anotherReference="Bertholdt. Berutholdo. Berutoru. Beruthordo"
//   />
//   <ClassComponent 
//     anotherReference="Three. Take it or leave it." 
//   />
// </>

const useStyles = makeStyles( (theme) => ({
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
    "& .MuiDrawer-paperAnchorDockedLeft": {
      borderRight: 0
    }
  }
}));

export function Description(props)
{
    const { variant, description } = props;

    const [expanded, setExpanded] = useState(false);

    const classes = useStyles();

    return (
      <div className={ classes.div }>
        <Drawer 
            elevation={0} 
            variant="permanent"
            open
        >
          <Card 
            className={ classes.card }
            variant="outlined"
          >
            
            <CardHeader
              avatar={
                <Avatar 
                  alt="Ilya Mazin pic" 
                  src="https://lh3.googleusercontent.com/ogw/ADea4I6XNuW4234Jki8A-Jhj0eceu9KczmhXBF-0BEbc=s192-c-mo"
                  sx={{
                    width: 56,
                    height: 56
                  }}
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

            <Collapse in={expanded}>
              
              <CardContent className={ classes.cardContent }>
                <Typography component={'span'}>
                  { description }
                </Typography>
              </CardContent>

            </Collapse>

            <CardActions disableSpacing className={ classes.actions }>
              <IconButton 
                onClick={() => { setExpanded(!expanded) }}
                style={{ marginLeft: "auto" }}
              >
                <span className="material-icons">info_outline</span>
              </IconButton>
            </CardActions>

          </Card>
        </Drawer>
      </div>
    );
}