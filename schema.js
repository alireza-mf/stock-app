const axios = require('axios');
const AV_API_KEY = require('./api_keys');
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLID
} = require('graphql');

const SymbolList = new GraphQLObjectType({
  name: 'Symbol_List',
  fields: () => ({
    symbol: {type: GraphQLString},
    name: {type: GraphQLString},
  })
});

///////////////

const StockDetail = new GraphQLObjectType({
  name: 'Stock_Detail',
  fields: () => ({
    selected_symbol: {type: GraphQLString},
    MetaData: {type: StockMetaData},
		TimeSeries: {type: TimeSeries}
  })
});

const StockMetaData = new GraphQLObjectType({
  name: 'Stock_Meta_Data',
  fields: () => ({
    Information: {type: GraphQLString},
    Symbol: {type: GraphQLString},
		LastRefreshed: {type: GraphQLString},
		OutputSize: {type: GraphQLString},
		TimeZone: {type: GraphQLString},
  })
});

const TimeSeries = new GraphQLObjectType({
  name: 'Time_Series',
  fields: () => ({
    Dates: {type: GraphQLList(TimeSeriesData)}
  })
});

const TimeSeriesData = new GraphQLObjectType({
  name: 'Time_Series_Data',
  fields: () => ({
    Date: {type: GraphQLString},
		Value: {type: TimeSeriesDataPoint},
  })
});

const TimeSeriesDataPoint = new GraphQLObjectType({
  name: 'Time_Series_Data_Point',
  fields: () => ({
    Open: {type: GraphQLString},
		High: {type: GraphQLString},
		Low: {type: GraphQLString},
		Close: {type: GraphQLString},
  })
});



// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    SymbolList: {
      type: new GraphQLList(SymbolList),
      resolve(parent, args) {
        return axios
          .get(`https://cloud.iexapis.com/stable/ref-data/symbols?token=sk_9eadecb3f2cd4f5582e37592d183e289`)
          .then((res)=>{return res.data;})
      }
    },
    StockDetail: {
      type: StockDetail,
      args: {
        selected_symbol: {type: GraphQLString},
      },
      resolve(parent, args) {
        return axios
          .get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${args.selected_symbol}&apikey=${AV_API_KEY}`)
          .then((res)=>{return res.data;})
          .then(
            obj=>{
              let dataStr = "Time Series (Daily)";
              obj.MetaData = {};
              obj.MetaData.Information = obj["Meta Data"]["1. Information"];
              obj.MetaData.Symbol = obj["Meta Data"]["2. Symbol"];
              obj.MetaData.LastRefreshed = obj["Meta Data"]["3. Last Refreshed"];
              obj.MetaData.OutputSize = obj["Meta Data"]["4. Output Size"];
              obj.MetaData.TimeZone = obj["Meta Data"]["5. Time Zone"];
              obj.TimeSeries = {};
              obj.TimeSeries.Dates = [];
              let keys = Object.keys(obj[dataStr]);
              keys.forEach(
                (item)=>{obj.TimeSeries.Dates.push({Date:item, Value:obj[dataStr][item]});}
              );
              obj.TimeSeries.Dates.forEach(
                (data)=>{
                  data.Value.Open = data.Value["1. open"];
                  data.Value.High = data.Value["2. high"];
                  data.Value.Low = data.Value["3. low"];
                  data.Value.Close = data.Value["4. close"];
                });
                return obj;
              },
            )
          
      }
    },
  }
});


module.exports = new GraphQLSchema({
  query: RootQuery,
});
