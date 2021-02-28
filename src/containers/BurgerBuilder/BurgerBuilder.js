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
    loading: false

  }

  componentDidMount(){
    axios.get("/ingredients.json")
        .then(response => {
          if(response)
            this.setState({ingredients: response.data})
          this.setState({loading: false});
        })
        .catch(err => {
          this.setState({loading: false});
          console.log(err);
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
     axios.post('/orders.json', order)
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



    let burger = <Spinner />
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
