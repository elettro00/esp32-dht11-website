import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { onValue, ref } from 'firebase/database';
import { rtDb } from './firebase'; // Assicurati di importare la tua configurazione Firebase

const Chart = ({ title, start, fine, bgColor, anim, um}) => {
    const [dataLimit, setDataLimit] = useState(10); // Numero iniziale di dati da visualizzare
    const [chartData, setchartData] = useState({
        labels: [],
        datasets: [
            {
                label: title,
                fill: false,
                lineTension: 0.1,
                backgroundColor: bgColor,
                borderColor: bgColor,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: bgColor,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: bgColor,
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: []
            }
        ]
    });

    const fetchData = (limit) => {
        const starCountRef = ref(rtDb, 'dht11/');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            const labels = [];
            const dataValues = [];
            const keys = Object.keys(data).filter(key => key !== "counter").slice(-limit); // Ottieni solo gli ultimi 'limit' dati

            keys.forEach(key => {
                if (fine && start) {
                    if (data[key][start][fine] !== null && !isNaN(data[key][start][fine])) { // Verifica se il valore è valido
                        labels.push([key, data[key].date]);
                        dataValues.push(data[key][start][fine]);
                    }
                }
                else if (start && fine === "") {
                    if (data[key][start] != null && !isNaN(data[key][start])) { // Verifica se il valore è valido
                        labels.push([key, data[key].date]);
                        dataValues.push(data[key][start]);
                    }
                }
            });

            setchartData({
                labels: labels,
                datasets: [{ ...chartData.datasets[0], data: dataValues }]
            });
        });
    };

    useEffect(() => {
        fetchData(dataLimit); // Carica i dati iniziali con il limite specificato
    }, [dataLimit]);

    const options = {
        plugins: {
            legend: {
                display: false // Disabilita la leggenda
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        // console.log(context)
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        const date = context.chart.data.labels[context.dataIndex][1]; // Accedi alla data salvata come secondo valore
                        return `${label}: ${value}${um} (${date})`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    callback: function (value, index, values) {
                        return chartData.labels[index][0]; // Utilizza il primo dato nei labels per l'asse x
                    }
                }
            }
        },
        
    };

    return (
        <div className="chart-container" data-aos={anim}>
            <h2 className='chart-title'>{title} nel tempo</h2>
            <div className="button-container">
                <button onClick={() => setDataLimit(10)}>10</button>
                <button onClick={() => setDataLimit(50)}>50</button>
                <button onClick={() => setDataLimit(100)}>100</button>
                <button onClick={() => setDataLimit(500)}>500</button>
                <button onClick={() => setDataLimit(1000)}>1000</button>
                <button onClick={() => setDataLimit(1000000)}>Max</button>
            </div>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default Chart;
