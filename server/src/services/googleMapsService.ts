import axios from "axios";
import { baseUrl } from "../utils";

export const geocodeAddress = async (address: string) => {

  try {
    const response = await axios.get(`${baseUrl.geocodeUrl}`, {
      params: {
        address,
        key: process.env.GOOGLE_API_KEY,
      },
    });

    if (response.data.status !== "OK") {
      console.error("Geocoding API Error:", response.data.status);
      return null;
    }

    const location = response.data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    };
  } catch (error: any) {
    console.error("Error in geocodeAddress:", error.message);
    return null;
  }
};


export const reverseGeocode = async (lat: number, lng: number) => {

  try {
    const response = await axios.get(`${baseUrl.geocodeUrl}`, {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_API_KEY,
      },
    });



    if (response.data.status !== "OK") {
      console.error("Reverse Geocoding API Error:", response.data.status);
      return `${lat}, ${lng}`;
    }

    const address = response.data.results[0]?.formatted_address || `${lat}, ${lng}`;
    return address; // Retorna o endereço formatado
  } catch (error: any) {
    console.error("Error in reverseGeocode:", error.message);
    return `${lat}, ${lng}`;
  }
};


/**
 * Calcula a rota entre duas coordenadas usando a API  Directions
 */
export const calculateRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) => {

  try {
    const response = await axios.get(`${baseUrl.directionUrl}`, {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: process.env.GOOGLE_API_KEY,
      },
    });

    if (response.data.status !== "OK") {
      console.error("Google Maps API Error:", response.data.status);
      throw new Error(`Google Maps API error: ${response.data.status}`);
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];//uma perna da viagem. 

    return {
      distance: leg.distance,
      duration: leg.duration,
      start_location: leg.start_location,
      end_location: leg.end_location,
      overview_polyline: route.overview_polyline,
    };
  } catch (error: any) {
    console.error("Error in calculateRoute:", error.message);
    throw new Error("An error occurred while calculating the route.");
  }
};
