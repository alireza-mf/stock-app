import React,{Fragment, useEffect, useRef} from 'react';
import ReactApexChart from 'react-apexcharts';
import _ from 'lodash';

const useScroll = () => {
  const elRef = useRef(null)
  const executeScroll = () => window.scrollTo({
    behavior: "smooth",
    top: elRef.current.offsetTop
  })

  return [executeScroll, elRef]
}


const CandleStickChart = ({TimeSeries}) => {
    const [executeScroll, elRef] = useScroll()
    useEffect(executeScroll, []) // Runs after component mounts

    // apexchart needs a specific data stracture so:
    const x = _.map(TimeSeries.Dates, 'Date');
    
    const pre_y = _.map(TimeSeries.Dates, 'Value');
    const y = pre_y.map( ({Open,High,Low,Close}) => [Open,High,Low,Close] );

    const pre_data = _.zip(x,y);
    const data = pre_data.map(function(v){
        return{
            x: v[0],
            y: v[1]
        }
    });
    const series=[{data}];

    console.log(series);

    return (
        <Fragment>
            <ReactApexChart
                series={series}
                type='candlestick'
                options={{
                    chart: {
                      type: 'candlestick',
                      height: 350
                    },
                    title: {
                      text: 'CandleStick Daily Chart',
                      align: 'left'
                    },
                    yaxis: {
                      tooltip: {
                        enabled: true
                      },
                      title: {
                        text: 'Price'
                      },
                    }
                  }}
                height={350}
            />
            <div ref={elRef}></div>
        </Fragment>
    );
};

export default CandleStickChart;