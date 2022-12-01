import React, {useEffect, useState} from 'react';
import moment from 'moment'

import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Filler
} from 'chart.js';
import {Line} from 'react-chartjs-2';

import {useDispatch, useSelector} from "react-redux";
import {Link, useSearchParams} from "react-router-dom";
import {CoinDataThunk, CoinMCThunk} from "../services/detail-thunks";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);



const LineChartArea = () => {

    let [searchParams] = useSearchParams();
    const {marketData, fetching} = useSelector((state) => {
        return state.coinMarketChart;
    });
    let [coinPrice, setCoinPrice] = useState(marketData.prices[marketData.prices.length - 1][1])

    const dispatch = useDispatch();
    useEffect(
        () => {
            dispatch(CoinMCThunk({coinID: searchParams.get("coinID"), days: searchParams.get("days")}));
        }, [dispatch, searchParams]
    )
    useEffect(() => {
        setCoinPrice(marketData.prices[marketData.prices.length - 1][1])
    }, [marketData.prices[marketData.prices.length - 1][1]])

    const options = {
        responsive: true,
        elements: {
            point: {
                pointStyle: "circle",
                radius: 0,
                hoverRadius: 6,
                // pointBorderWidth: 0,
                // pointHoverBorderWidth: 0,
            },
            line: {
                // fill: true,
                // backgroundColor: ,
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltip: {
                // position: "nearest"
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                display: false,
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 0,
                    maxTicksLimit: 7
                }
            }
        },
        onHover: function(evt, item) {
            if (item.length) {
                setCoinPrice(item[0].element.$context.raw)
            }
        }
    };


    const labels = marketData.prices.map(
        (price) => {
            const unixTimestamp = price[0];
            let t = new Date(unixTimestamp);
            return moment(t).format("dd hh:MM");
        }
    );
    const data = {
        labels,
        datasets: [
            {
                label: 'USD', // Should be coin name
                data: marketData.prices.map((price) => {
                    // return Math.round((rawPrice + Number.EPSILON) * 1000000) / 1000000
                    return price[1]
                }),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                fill: true

            }
        ],
    };

    const getRoundDigit = (num) => {
        let reverseNum = 1 / num;
        if (reverseNum < 0) {
            // num is larger than 0
            return 100;
        } else {
            // num is smaller than 0
            reverseNum = Math.round(reverseNum);
            return 10 ** (reverseNum.toString().length + 2);
        }
    }

    const roundDigit = getRoundDigit(coinPrice);

    return (
        fetching
            ?<h4>Loading</h4>
            :
        <div className="d-flex flex-column align-items-center">
            <div id={"timeRangeNavigation"} className={"d-flex col-8"}>
                <h3 className={"fw-bold ms-5"}><i className="fa-solid fa-dollar-sign"></i>{Math.round((coinPrice + Number.EPSILON) * roundDigit) / roundDigit}</h3>
                <ul className="nav nav-pills ms-auto">
                    <Link to={{
                        pathname: '.',
                        search: "coinID=" + searchParams.get("coinID") + "&days=1"
                    }} className={`nav-link ${searchParams.get("days") === null || searchParams.get("days") === '1' ? 'active':''}`}
                    >24h</Link>
                    <Link to={{
                        pathname: '.',
                        search: "coinID=" + searchParams.get("coinID") + "&days=7"
                    }} className={`nav-link ${searchParams.get("days") === '7' ? 'active':''}`}
                    >1W</Link>
                    <Link to={{
                        pathname: '.',
                        search: "coinID=" + searchParams.get("coinID") + "&days=30"
                    }} className={`nav-link ${searchParams.get("days") === '30' ? 'active':''}`}
                    >1M</Link>
                </ul>
            </div>
            <div id="price_trend_chart" className={"col-8 mt-2"}>
                <Line options={options} data={data}/>
            </div>
        </div>

    );

}

export default LineChartArea;