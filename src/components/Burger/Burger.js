import React from 'react';

import classes from './Burger.css';
import Ingredients from './Ingredients/Ingredients'

const burger = (props) => {

  const ingredientsArray = Object.keys(props.ingredients).map(igKey => {
    return [...Array(props.ingredients[igKey])].map( (_,i) => {
          return <Ingredients type={igKey} key={igKey+i} />

    });
  }).reduce((arr,el) => {
    return arr.concat(el)

  }, []);   

  return (
    <div className={classes.Burger}>
      <Ingredients type = "bread-top" />
      {ingredientsArray}
      <Ingredients type = "bread-bottom" />
    </div>

  );
};

export default burger;
