import React from 'react';
import classes from './BuildControls.css';
import Control from './Control/Control';

const controlsLabel = [
  {label : 'Salad', type : 'salad'},
  {label : 'Bacon', type : 'bacon'},
  {label : 'Cheese', type : 'cheese'},
  {label : 'Meat', type : 'meat'},
];


const buildControls = (props) => (

  <div className={classes.BuildControls} >

    <p> <strong> Current Price: { props.price.toFixed(2)} </strong> </p>

    {controlsLabel.map( ctrl => {
       return  <Control key={ctrl.label} label={ctrl.label}
                    added={()=> props.ingredientAdded(ctrl.type)}
                     removed={()=> props.ingredientRemoved(ctrl.type)}
                     disabled={props.disabled[ctrl.type]}
                     overAdded={props.overAdded[ctrl.type]}
                     />

    })}
    <br/>


    <button disabled={!props.purchasable}
            className={classes.OrderButton}
            onClick={props.order}> ORDER NOW </button>
  </div>



)

export default buildControls;
