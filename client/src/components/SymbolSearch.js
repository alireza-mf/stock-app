import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Autosuggest from 'react-autosuggest'
import StockCharts from './StockCharts';

const SYMBOL_QUERY = gql`
  query SymbolQuery {
    SymbolList{ 
    	symbol
    	name
    }
  }
`;


let SymbolList= [];

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : SymbolList.filter(d =>
    d.symbol.toLowerCase().slice(0, inputLength) === inputValue
  ).slice(0,10);
};

const getSuggestionValue = suggestion => suggestion.symbol;

const renderSuggestion = suggestion => (
  <div>
    <strong>{suggestion.symbol}</strong>{' - '}<small>{suggestion.name}</small>
  </div>
);


export class SymbolSearch extends Component {
  constructor(props){
    super()
    this.state ={
      value: '',
      suggestions: [],
      showChart: false,
      selected: ''
    }
  }


  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleClick(e){
    this.setState({selected: this.state.value});
    this.setState({showChart: true});
  };

  render() {
    const { value, suggestions, showChart, selected } = this.state;

    const inputProps = {
      placeholder: 'Type Stock Symbol',
      value,
      onChange: this.onChange,
    };
    const disabledinputProps = {
      placeholder: 'Loading Symbols . . .',
      value,
      onChange: this.onChange,
      disabled: true
    };
    


    return (
      <Fragment>
        <div className="card border-primary mb-3 mx-auto" style={{maxWidth:"40rem", marginTop:"30px"}} >
        <div className="card-header">
          <h3>Select company</h3>
        </div>
        <div className="card-body text-center">
        
        <Query query={SYMBOL_QUERY}>
          {({ loading, error, data }) => {
            if (loading) 
              return (
                <Fragment>
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={disabledinputProps}
                  />
                  <div className="progress mx-auto" style={{maxWidth:"15rem", marginTop:"10px",marginBottom:"15px"}}>
                    <div className="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar" style={{width:"100%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <h5>Loading . . .</h5>
                  <button type="button" disabled={!value} className="btn btn-outline-info" onClick={this.handleClick.bind(this)} style={{marginTop:"20px"}}>Show Informations</button>
                </Fragment>
              );
            if (error)
              return (
                <Fragment>
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                  />
                  <button type="button" disabled={!value} className="btn btn-outline-info" onClick={this.handleClick.bind(this)} style={{marginTop:"40px"}}>Show Informations</button>
              </Fragment>
              );
            
            SymbolList= data.SymbolList.slice();
            return (
              <Fragment>
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                  />
                  <button type="button" disabled={!value} className="btn btn-outline-info" onClick={this.handleClick.bind(this)} style={{marginTop:"40px"}}>Show Informations</button>
              </Fragment>
            );
          }}
        </Query>
        </div>
        </div>
        {showChart ? <StockCharts selected_symbol={selected}/> : null}
      </Fragment>
    );
  }
}

export default SymbolSearch;