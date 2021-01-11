import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Select from 'react-select';
import LineChart from "./LineChart";
import CandleStickChart from "./CandleStickChart";


const STOCK_QUERY = gql`
  query StockQuery($selected_symbol: String!) {
    StockDetail(selected_symbol: $selected_symbol){
      MetaData{
        Information
        Symbol
        LastRefreshed
        OutputSize
        TimeZone
      }
      TimeSeries{
        Dates{
          Date
          Value{
            Open
            High
            Low
            Close
          }
        }
      }
    }
      
  }
`;

const StockCharts = ({selected_symbol}) => {
  const [typeOfChart,setTypeOfChart] = useState('');

  const {loading, error, data} = useQuery(STOCK_QUERY, { variables:{selected_symbol} });
  if(loading) return (
    <div className="card border-primary mb-3 mx-auto" style={{maxWidth:"40rem", marginTop:"20px"}} >
      <div className="card-header">
        <h3>Loading Charts . . .</h3>
      </div>
      <div className="card-body text-center">
        <div className="progress mx-auto" style={{maxWidth:"25rem", marginTop:"10px"}}>
          <div className="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar" style={{width:"100%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>);
  if(error) return (<div className="card text-white bg-primary mb-3 mx-auto" style={{maxWidth:"40rem", marginTop:"20px", padding:"15px"}}><h3 className="text-center">Ivalid Stock Symbol</h3></div>);

  


  const displayTheRightChart = () => {
      switch (typeOfChart.value) {
          case 'line':
              return (<LineChart
                TimeSeries={data.StockDetail.TimeSeries}
              />);
          case 'candlestick':
              return (<CandleStickChart
                TimeSeries={data.StockDetail.TimeSeries}
              />);
          default:
              return (<LineChart
                TimeSeries={data.StockDetail.TimeSeries}
              />);
      }
  };

  return (
    <div className="card border-primary mb-3 mx-auto" style={{maxWidth:"40rem", marginTop:"30px"}} >
        <div className="card-header">
          <h3>Stock Chart</h3>
        </div>
        <div className="card-body text-center">
          <div>
            <h4>Type of Chart: </h4>
              <Select
                options={[
                  { value:'line', label:'Line' },
                  { value:'candlestick', label:'CandleStick' },
                ]}
                value={typeOfChart}
                onChange={setTypeOfChart}
                defaultInputValue='Line'
              />
          </div>
          <div>
            {displayTheRightChart()}
          </div>
      </div>
    </div>
  );
};

export default StockCharts;