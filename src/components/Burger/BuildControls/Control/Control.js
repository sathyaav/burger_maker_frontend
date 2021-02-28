import React from 'react';
import classes from './Control.css'


const control = (props) => (

  <div className={classes.Control}>
    <div className={classes.Label}>{props.label} </div>
    <button className={classes.Control.Less} onClick={props.removed} disabled={props.disabled}> Less </button>
    <button className={classes.Control.More} onClick={props.added} disabled={props.overAdded}> More </button>

  </div>
);

export default control;
