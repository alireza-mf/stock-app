import React,{Fragment, useEffect, useRef} from 'react';
import ReactApexChart from 'react-apexcharts';
import _ from 'lodash';

const useScroll = () => {
  const elRef = useRef(null)
  const executeScroll = () => window.scrollTo({
    behavior: "smooth",
    block: 'start',
    top: elRef.current.offsetTop
  })

  return [executeScroll, elRef]
}


const LineChart = ({TimeSeries}) => {
    const [executeScroll, elRef] = useScroll()
    useEffect(executeScroll, []) // Runs after component mounts

    // apexchart needs a specific data stracture so:
    const x = _.map(TimeSeries.Dates, 'Date');
    
    const pre_y = _.map(TimeSeries.Dates, 'Value');
    const y = pre_y.map( ({Close}) => [Close] );

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
                series ={series}
                type='line'
                options ={{
                    chart: {
                      height: 350,
                      zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                      },
                      toolbar: {
                        autoSelected: 'zoom'
                      }
                    },
                    markers: {
                      size: 0,
                    },
                    title: {
                      text: 'Stock Price Daily Movement',
                      align: 'left'
                    },
                    yaxis: {
                      title: {
                        text: 'Price'
                      },
                    },
                    tooltip: {
                      shared: false,
                      
                    }
                  }
                }
            />
            <div ref={elRef}></div>
        </Fragment>
    );
};

export default LineChart;