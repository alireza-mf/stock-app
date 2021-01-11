import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SymbolSearch from './components/SymbolSearch';
import './App.css';

const client = new ApolloClient({
  uri: '/graphql'
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <h4><a className="navbar-brand"href="/">Stock Chart App</a></h4>
          </nav>
          <div className="container">
            <Route exact path="/" component={SymbolSearch} />
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;

