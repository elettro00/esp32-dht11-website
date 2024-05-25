import './App.css';
import NavBar from './NavBar';
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, Tooltip} from 'chart.js';
import Chart from './Chart';
import { useEffect, useState } from 'react';
import Description from './Description';
import AOS from 'aos';
import 'aos/dist/aos.css';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, Tooltip, Title);

function App() {

  useEffect(() => {
    AOS.init({
      duration: 750,
      delay:180
    });
  }, [])

  const [typeC, setTypeC] = useState(true);

  return (
    <div className="App">
      <NavBar changeType={setTypeC} type={typeC}/>

      <hr id="t"/>

      <div className='chart-sct' style={{marginTop:"60px"}}>
        {typeC && <Chart anim="fade-down-right" title="Temperatura (°C)" start="temperature" fine="Celsius"  bgColor={'rgba(75,192,192,1)'} um="°C"/>}
        {!typeC && <Chart anim="fade-down-right" title="Temperatura (°F)" start="temperature" fine="Fahrenheit" bgColor={"rgba(34,75,63,1)"} um="°F"/>}
        <Description anim={"fade-left"} title={"Monitoraggio Temperatura"} 
        dscrpt1={`Nel seguente grafico si può osservare la temperatura in gradi ${typeC ? "°C" : "°F"} dei dati presi in tempo reale dal DHT11 inferfacciato con l'esp32.`}
        dscrptX={"Sull'asse delle ascisse troviamo rappresentati il numero della misura eseguita."}
        dscrptY={"Sull'asse delle ordinate troviamo rappresentata la temperatuara della misura eseguita."}
        dscrptHover={"Puntando con il cursore su un dato del grafico, verra rappresentato un tooltip contenente i dati dei due assi e la data di quando sono stati misurati."}
        />
      </div>

      <hr id="hi "/>

      <div className='chart-sct' data-aos="fade-down-right">
      <Description anim={"fade-right"} title={"Monitoraggio Indice di Calore"}
      dscrpt1={`Nel seguente grafico si può osservare l'indece di calore in gradi ${typeC ? "°C" : "°F"} dei dati presi in tempo reale dal DHT11 inferfacciato con l'esp32.`}
      dscrptX={"Sull'asse delle ascisse troviamo rappresentati il numero della misura eseguita."}
      dscrptY={"Sull'asse delle ordinate troviamo rappresentato l'indice di calore della misura eseguita."}
      dscrptHover={"Puntando con il cursore su un dato del grafico, verra rappresentato un tooltip contenente i dati dei due assi e la data di quando sono stati misurati."}
      />
        {typeC && <Chart anim="fade-down-left" title="HeatIndex (°C)" start="HeatIndex" fine="Celsius" bgColor={"rgba(5,223,78,1)"} um="°C"/>}
        {!typeC && <Chart anim="fade-down-left" title="HeatIndex (°F)" start="HeatIndex" fine="Fahrenheit" bgColor={"rgba(200,150,32,1)"} um="°F"/>}
      </div>

      <hr id="u"/>

      <div className='chart-sct' data-aos="fade-down-left">
        <Chart anim="fade-down-left" title="Umidità (%)" start="Humidity" fine="" bgColor={"rgba(192,75,192,1)"} um="%"/>
        <Description anim="fade-left" title={"Monitoraggio Umidità"}
        dscrpt1={"Nel seguente grafico si può osservare l'umidità' in (%) dei dati presi in tempo reale dal DHT11 inferfacciato con l'esp32."}
        dscrptX={"Sull'asse delle ascisse troviamo rappresentati il numero della misura eseguita."}
        dscrptY={"Sull'asse delle ordinate troviamo rappresentata la temperatuara della misura eseguita."}
        dscrptHover={"Puntando con il cursore su un dato del grafico, verra rappresentato un tooltip contenente i dati dei due assi e la data di quando sono stati misurati."}/>
      </div>

      <hr />

      <div className="footer" data-aos="fade-left" data-aos-duration="700">
        <h2>Project made by Manuel, Alessio, Samuele</h2>
      </div>
      
      <hr style={{marginBottom:"25px"}} />
    </div>
  );
}

export default App;
