
import { Request, Response } from "express";
import { calculateRoute, geocodeAddress, reverseGeocode } from "../services/googleMapsService";
import { prisma } from "../database/prisma";

export const estimateController = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { customer_id, origin, destination } = req.body;
  console.log(customer_id, origin, destination)
  if (!customer_id || !origin || !destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "ID do cliente, origem e destino são obrigatórios.",
    });

  }

  if (origin === destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Origem e destino não podem ser os mesmos..",
    });
  }

  try {
    // Geocodifica os endereços
    const originCoordinates = await geocodeAddress(origin);
    const destinationCoordinates = await geocodeAddress(destination);

    if (!originCoordinates || !destinationCoordinates) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Endereço de origem ou destino inválido.",
      });
    }

    // Calcula a rota
    const route = await calculateRoute(originCoordinates, destinationCoordinates);

    const distanceInKm = Math.round(route.distance.value / 1000);
    const duration = route.duration.text;

    // Realiza geocodificação reversa para obter os nomes dos lugares
    const originName = await reverseGeocode(originCoordinates.lat, originCoordinates.lng);
    const destinationName = await reverseGeocode(destinationCoordinates.lat, destinationCoordinates.lng);

    // Busca motoristas disponíveis
    const drivers = await prisma.driver.findMany();// busca todos os registros  na tabela driver

    const options = drivers
      .filter((driver) => distanceInKm >= driver.minKm)
      .map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: {
          rating: driver.rating,
          comment: driver.comment,
        },
        value: distanceInKm * driver.ratePerKm,
      }))
      .sort((a, b) => a.value - b.value);


    return res.status(200).json({
      customer_id,
      origin: {
        name: originName || `${originCoordinates.lat}, ${originCoordinates.lng}`, // Nome ou fallback
        coordinates: route.start_location,
      },
      destination: {
        name: destinationName || `${destinationCoordinates.lat}, ${destinationCoordinates.lng}`, // Nome ou fallback
        coordinates: route.end_location,
      },
      distance: distanceInKm,
      duration,
      options,
      routeResponse: {
        routes: [
          {
            overview_polyline: route.overview_polyline,
          },
        ],
      },
    });

  } catch (error: any) {
    return res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Ocorreu um erro ao processar sua solicitação.",
    });
  }
};
