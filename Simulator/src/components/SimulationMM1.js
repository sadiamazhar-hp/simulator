import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RandomDataTab from './Simulation/MM1/RandomDataTabMM1';
import CalculatedDataTab from './Simulation/MM1/CalculatedDataTabMM1';
import GraphicalViewTab from './Simulation/MM1/GraphicalViewTabMM1';
import background from "../assests/pictures/simulator.jpg";


const SimulationMM1 = () => {
  const [activeTab, setActiveTab] = useState('random');
  const [randomData, setRandomData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const [arrivalMean, setArrivalMean] = useState(0);
  const [serviceMean, setServiceMean] = useState(0);
  const location = useLocation();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const arrivalMeanParam = parseFloat(params.get('arrivalMean'));
    const serviceMeanParam = parseFloat(params.get('serviceMean'));
   

    if (!isNaN(arrivalMeanParam) && !isNaN(serviceMeanParam)) {
      setArrivalMean(arrivalMeanParam);
      setServiceMean(serviceMeanParam);

      const data = generateRandomData(10, arrivalMeanParam, serviceMeanParam);
      setRandomData(data);

      const calculatedData = calculateCalculatedData(data);
      setCalculatedData(calculatedData);
    }

}, [location.search]);


const generateRandomData = (count, arrivalMean, serviceMean) => {
    const data = [];
    let arrivalTime = 0;
  
    for (let i = 1; i <= count; i++) {
      const interarrivalTime = Math.round(generateRandomTime(arrivalMean));
      const serviceTime = Math.round(generateRandomTime(serviceMean));
  
      arrivalTime += interarrivalTime;
  
      data.push({
        customer: i,
        interarrivalTime,
        arrivalTime: i === 1 ? 0 : arrivalTime,
        serviceTime: Math.max(1, Math.min(10, serviceTime)), // Ensure value is within 1 to 10 range
      });
    }
  
    return data;
  };
  
  const generateRandomTime = (mean) => {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();
    // Calculate the time based on the mean
    const time = Math.round(-Math.log(1 - randomNumber) * mean);
    return time;
  };
  
  
  

  const calculateCalculatedData = (data) => {
    const calculatedData = [];
  
    let startTime = 0;
    let totalWaitTime = 0;
    let totalTurnaroundTime = 0;
    let serverIdleTime = 0;
    let serverUtilizationTime = 0;
  
    for (let i = 0; i < data.length; i++) {
      const { customer, interarrivalTime, arrivalTime, serviceTime } = data[i];
      const endTime = Math.max(arrivalTime, startTime) + serviceTime;
      const waitTime = Math.max(0, startTime - arrivalTime);
      const turnaroundTime = waitTime + serviceTime;
      console.log(
        i+1 +
          ' start time: ' +
          startTime +
          ' endTime: ' +
          endTime +
          ' arrival time: ' +
          arrivalTime +
          ' wait time: ' +
          waitTime +
          ' turnaround: ' +
          turnaroundTime
      );
  
      calculatedData.push({
        customer,
        interarrivalTime,
        arrivalTime,
        serviceTime,
        startTime: Math.max(arrivalTime, startTime),
        endTime,
        waitTime,
        turnaroundTime,
      });
  
      totalWaitTime += waitTime;
      totalTurnaroundTime += turnaroundTime;
  
    
      serverUtilizationTime += serviceTime;
  
      startTime = endTime;
    }
  
    const averageWaitTime = totalWaitTime / data.length;
    const averageTurnaroundTime = totalTurnaroundTime / data.length;
    const totalTime = startTime;
    const serverUtilization = serverUtilizationTime / totalTime ;
    const serverIdle = 1 - serverUtilization;

   
    return {
      calculatedData,
      averageWaitTime,
      averageTurnaroundTime,
      serverUtilization,
      serverIdle,
    };
  };
  

  return (
    <div className="flex flex-col items-center w-full h-full" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', opacity: '0.5' }}>
      <div className="w-full max-w-3xl flex justify-center space-x-4 my-8">
        <button
          className={`tab-button bg-gray-50 border styled text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${activeTab === 'random' ? 'active' : ''}`}
          onClick={() => handleTabChange('random')}
        >
          Random Data
        </button>
        <button
          className={`tab-button bg-gray-50 border styled text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${activeTab === 'calculated' ? 'active' : ''}`}
          onClick={() => handleTabChange('calculated')}
        >
          Calculated Data
        </button>
        <button
          className={`tab-button  bg-gray-50 border styled text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${activeTab === 'graphical' ? 'active' : ''}`}
          onClick={() => handleTabChange('graphical')}
        >
          Graphical View
        </button>
      </div>

      <div className="w-full ">
        {activeTab === 'random' && <RandomDataTab randomData={randomData} />}
        {activeTab === 'calculated' && <CalculatedDataTab calculatedData={calculatedData} />}
        {activeTab === 'graphical' && <GraphicalViewTab calculatedData={calculatedData} />}
      </div>
    </div>
  );
};

export default SimulationMM1;
