import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-order';


const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component{

  state = {
    ingredients: null,
    totalPrice : 2,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false

  }

  componentDidMount(){
    axios.get("/initialIngredients")
        .then(response => {
          let ing = response.data;
          delete ing["id"];
          if(response)
            this.setState({ingredients: ing})
          console.log(this.state.ingredients);
          this.setState({loading: false});
        })
        .catch(err => {
          this.setState({error: true});
          console.log(err)
        });
  }


  updatePurchasableState(ingredients) {

      const sum = Object.keys(ingredients)
      .map(igKey => {
          return ingredients[igKey]
        })
      .reduce((sum, el)=> {
        return sum+el;
      }  ,0);
      console.log("sum",sum)
      this.setState({purchasable: sum>0})

  }


  purchasingHandler = (type) => {
    this.setState({purchasing:true});
  }

  purchaseCancelHandler = (type) => {
    this.setState({purchasing:false});
  }

  purchaseContinueHandler =(type) =>{
     this.setState({loading: true});
     const order = {
       ingredients : this.state.ingredients,
       price : this.state.totalPrice,
       customer :{
         name: 'Sathyaa',
         address: {
           street: 'test',
           zipCode: '12324',
           country: 'Germany'
         },
         email:'test@test.com'
       },
       deliveryMethod: 'fastest'
     }
     axios.post('/orders', order)
        .then(response => {

          this.setState({loading: false, purchasing: false});
          console.log(response);
        })
        .catch(err => {
          this.setState({loading: false, purchasing: false});
          console.log(err);
        });


  }

  addIngredientHandler = (type) => {
      const oldCount = this.state.ingredients[type];
      const updatedCount = oldCount+1;
      const updatedIngredients = {
        ...this.state.ingredients
      };
      updatedIngredients[type] = updatedCount;
      const additionalPrice = INGREDIENT_PRICES[type];
      const newPrice = (this.state.totalPrice + additionalPrice);
      this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
      this.updatePurchasableState(updatedIngredients);
      console.log("upgraded : ", updatedIngredients);
  }

  removeIngredientHandler = (type) => {
      const oldCount = this.state.ingredients[type];
      if (oldCount <=0){
        return;
      }
      const updatedCount = oldCount-1;
      const updatedIngredients = {
        ...this.state.ingredients
      };
      updatedIngredients[type] = updatedCount;
      const additionalPrice = INGREDIENT_PRICES[type];
      const newPrice = (this.state.totalPrice - additionalPrice);
      this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
      this.updatePurchasableState(updatedIngredients);
  }



  render(){

    const disabledInfo = {
      ...this.state.ingredients
    };
    const overAddedInfo = {
      ...this.state.ingredients
    }
    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <=0 ;
      overAddedInfo[key] = overAddedInfo[key] >3;
    }

    let orderSummary = null;


    let burger = this.state.error? <p> Ingredients can't be loaded </p>: <Spinner />
    if(this.state.ingredients){
      burger = (
        <Aux>

            <Burger ingredients={this.state.ingredients}/>


            <BuildControls ingredientAdded={this.addIngredientHandler}
                  ingredientRemoved={this.removeIngredientHandler}
                  disabled={disabledInfo}
                  overAdded={overAddedInfo}
                  price={this.state.totalPrice}
                  purchasable={this.state.purchasable}
                  order={this.purchasingHandler}
            />

        </Aux>


      );

      orderSummary =   <OrderSummary
             ingredients={this.state.ingredients}
             purchaseCancelled={this.purchaseCancelHandler}
             purchaseContinue={this.purchaseContinueHandler}
             price={this.state.totalPrice}
       />

       if(this.state.loading){
         orderSummary = <Spinner />;
       }
    }

    return(
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            {orderSummary}
        </Modal>
        {burger}
      </Aux>

    )
  }
}

export default withErrorHandler(BurgerBuilder, axios);
