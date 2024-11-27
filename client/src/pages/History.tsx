

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Ride {
  id: number;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    name: string;
  };
  value: number;
}

const TripHistory: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    setError("");

    if (!customerId) {
      setError("O ID do usuário é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/ride/${customerId}`);
      setRides(response.data.rides || []);
    } catch (err: any) {
      setError("Erro ao buscar histórico de viagens.");
    } finally {
      setLoading(false);
    }
  };
const navigate = useNavigate();
  const handleGoBack =()=>{
    navigate("/options");
  }
  return (

    <div className="max-w-4xl mx-auto p-4">
      <button className="flex items-center  font-bold text-zinc-600" onClick={handleGoBack}>
        <h2>voltar</h2>
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h1 className="text-2xl font-bold mb-4 text-red-700">Histórico de Viagens</h1>
      <div className="mb-4">
        <label className="block font-medium mb-2">ID do Usuário</label>
        <input
          type="text"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        onClick={handleFilter}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Carregando..." : "Aplicar Filtro"}
      </button>
      <div className="p-2 mt-10">
        <h1 className="font-bold text-zinc-600">Lista de viagens e Motoristas</h1>
      </div>
      <div className="mt-8">
        {rides.length > 0 ? (
          rides.map((ride) => (
            <>
              <div
                key={ride.id}
                className="border p-4 mb-4 rounded shadow-lg bg-white"
              >
                <p><strong>Data:</strong> {new Date(ride.date).toLocaleString()}</p>
                <p><strong>Motorista:</strong> {ride.driver.name}</p>
                <p><strong>Origem:</strong> {ride.origin}</p>
                <p><strong>Destino:</strong> {ride.destination}</p>
                <p><strong>Distância:</strong> {ride.distance} km</p>
                <p><strong>Tempo:</strong> {ride.duration}</p>
                <p><strong>Valor:</strong> R${ride.value.toFixed(2)}</p>
              </div>
            </>
          ))
        ) : (
          <p className="text-gray-700">Nenhuma viagem encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default TripHistory;
