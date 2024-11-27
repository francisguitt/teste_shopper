


import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TripOptions from "../components/TripOptions";
import api from "../services/api";
import { baseUrl } from "../utils";

interface RouteInfo {
  customer_id: string;
  origin: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
  distance: number;
  duration: string;
  options: any[];
  routeResponse?: {
    routes: {
      overview_polyline: {
        points: string;
      };
    }[];
  };
}


const Options: React.FC = () => {


  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = location.state as RouteInfo;
    if (!data) {
      navigate("/");
      return;
    }

    setRouteInfo(data);
    setDrivers(data.options || []);
  }, [location, navigate]);

  const handleSelectDriver = async (driver: any) => {
    try {
      if (!routeInfo) {
        setError("Informações da rota estão ausentes.");
        return;
      }

      const response = await api.patch("/ride/confirm", {
        customer_id: routeInfo.customer_id,
        origin: {
          location: {
            latLng: {
              latitude: routeInfo.origin.coordinates.lat,
              longitude: routeInfo.origin.coordinates.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: routeInfo.destination.coordinates.lat,
              longitude: routeInfo.destination.coordinates.lng,
            },
          },
        },
        distance: routeInfo.distance,
        duration: routeInfo.duration,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: driver.value,
      });

      console.log("Viagem confirmada:", response.data);
      alert("Corrida ceita!  proximo passo, digite seu ID para ver suas listas de corrida.")
      navigate("/history");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error_description || "Erro ao confirmar a viagem.";
      setError(errorMessage);
      console.error("Erro ao confirmar viagem:", errorMessage);
    }
  };

  if (!routeInfo) {
    return <p>Carregando...</p>;
  }


  const polylinePoints = routeInfo.routeResponse?.routes?.[0]?.overview_polyline?.points || "";
  const staticMapUrl = `${baseUrl.staticmap}?size=2000x2000&path=enc:${encodeURIComponent(polylinePoints)}&markers=color:green|label:A|${routeInfo.origin.coordinates.lat},
  ${routeInfo.origin.coordinates.lng}&markers=color:red|label:B|${routeInfo.destination.coordinates.lat},
  ${routeInfo.destination.coordinates.lng}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;

  return (

    <div className="flex flex-col lg:flex-row mt-10">
      <div className="flex flex-col max-w-7xl -mt-5 mx-auto">
        <div className="max-w-96 ml-2">
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <h2 className="text-lg font-semibold  text-red-700">Detalhes da Rota</h2>
          <p>
            <strong>Origem:</strong> {routeInfo.origin.name}
          </p>
          <p>
            <strong>Destino:</strong> {routeInfo.destination.name}
          </p>
          <p>
            <strong>Distância:</strong> {Math.round(routeInfo.distance)} km
          </p>
          <p>
            <strong>Duração:</strong> {routeInfo.duration}
          </p>
        </div>
        <div className="  flex justify-center items-center text-center p-1 w-[500px] h-[500px] mx-auto">
          <img
            src={staticMapUrl}
            alt="Mapa da rota"
            className="w-full h-full rounded shadow-md"
          />
        </div>
      </div>
      <TripOptions
        drivers={drivers}
        polylinePoints={polylinePoints}
        onSelectDriver={handleSelectDriver}
      />
    </div>
  );
};

export default Options;
