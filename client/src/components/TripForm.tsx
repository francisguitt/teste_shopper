
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface TripFormData {
  customer_id: string;
  origin: string;
  destination: string;
}

const TripForm: React.FC = () => {

  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerId || !origin || !destination) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const data: TripFormData = {
        customer_id: customerId,
        origin,
        destination,
      };

      const response = await api.post("/ride/estimate", data);
      navigate("/options", { state: response.data });

    } catch (err: any) {
      if (err.response) {
        setError(err.response?.data?.error_description || "Erro ao calcular a viagem.");
      } else {
        setError("Erro desconhecido ao calcular a viagem.");
        console.log(err.response.data.error_description)
      }
    }
  };

  return (

    <div className="max-w-md mx-auto p-4  shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Solicitar Viagem</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 ">
          <label className="block font-medium">ID do Usuário</label>
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Origem</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Destino</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Estimar Viagem
        </button>
      </form>
    </div>
  );
};

export default TripForm;