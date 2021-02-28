import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Auxillary';

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    }



    componentWillUpdate(props){

      //Global interceptor for error handling
      axios.interceptors.request.use(req => {
        //reset error to null on any request
        this.setState({error: null});

        return req;
      });

      axios.interceptors.response.use( res => res, error => {
        this.setState({error: error});

        return error;
      });
    }

    errorConfirmedHandler = () =>{
      this.setState({error:null});
    }


    render () {
      return (
        <Aux>
          <Modal show={this.state.error}
                  modalClosed={this.errorConfirmedHandler}>
              {this.state.error? this.state.error.message:null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }

  }
}

export default withErrorHandler;