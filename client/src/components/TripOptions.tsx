

import React from "react";
import { useNavigate } from "react-router-dom";


interface Driver {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment: string;
  };
  value: number;
}

interface TripOptionsProps {
  drivers: Driver[];
  polylinePoints: string;
  onSelectDriver: (driver: Driver) => void;
}

const TripOptions: React.FC<TripOptionsProps> = ({ drivers,  onSelectDriver }) => {

  const navigate = useNavigate();
  const handleToHistory = () => {
    navigate("/history")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4 text-red-700">Opções de Viagem</h1>
        <button onClick={handleToHistory}
          className="bg-red-500 rounded-lg p-4 py-2 ">
          <h2 className="text-white font-bold text-sm">Histórico de viagens</h2>
        </button>
      </div>
 
      <div>
        {drivers.length > 0 ? (
          drivers.map((driver) => (
            <div
              key={driver.id}
              className="border p-4 mb-4 rounded shadow-lg flex justify-between items-center bg-white"
            >
              <div>
                <h2 className="text-xl font-bold">{driver.name}</h2>
                <p>{driver.description}</p>
                <p>
                  <strong>Veículo:</strong> {driver.vehicle}
                </p>
                <p>
                  <strong>Avaliação:</strong> {driver.review.rating}/5
                </p>
                <p>
                  <strong>Comentário:</strong> {driver.review.comment}
                </p>
                <p>
                  <strong>Preço:</strong> R${driver.value.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => onSelectDriver(driver)}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 "
              >
                Escolher
              </button>
            </div>
          ))
        ) : (
          <p>Não há motoristas disponíveis para esta rota.</p>
        )}
      </div>
    </div>
  );
};

export default TripOptions;
