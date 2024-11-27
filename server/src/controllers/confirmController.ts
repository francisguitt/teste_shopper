

import { Request, RequestHandler, Response } from "express";
import { prisma } from "../database/prisma";
import { reverseGeocode } from "../services/googleMapsService";

export const confirmController = async (req:Request, res: Response): Promise<Response | void> => {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

  if (
    !customer_id ||
    !origin?.location?.latLng ||
    !destination?.location?.latLng ||
    !distance ||
    !duration ||
    !driver?.id ||
    !value
  ) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Todos os campos precisa ser prenchidos.",
    });
  }

  const { latitude: originLat, longitude: originLng } = origin.location.latLng; // lat e lng
  const { latitude: destinationLat, longitude: destinationLng } = destination.location.latLng; // lat e lng

  if (originLat === destinationLat && originLng === destinationLng) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Origem e destino não podem ser os mesmos.",
    });
  }

  try {
    // Obter nomes legíveis para origem e destino
    const originName = await reverseGeocode(originLat, originLng);
    const destinationName = await reverseGeocode(destinationLat, destinationLng);

    // Verificar se o motorista existe
    const validDriver = await prisma.driver.findUnique({ where: { id: driver.id } });

    if (!validDriver) {
      return res.status(404).json({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "O motorista selecionado não existe.",
      });
    }

    // Verificar a distância mínima para o motorista
    if (distance < validDriver.minKm) {
      return res.status(406).json({
        error_code: "INVALID_DISTANCE",
        error_description: "A distância está abaixo do mínimo permitido ao motorista.",
      });
    }

    // Salvar a corrida no banco de dados com os nomes de origem e destino
    await prisma.ride.create({
      data: {
        customerId: customer_id,
        origin: originName, // Nome da origem
        destination: destinationName, // Nome do destino
        distance,
        duration,
        value,
        driverId: driver.id,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {

    return res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Ocorreu um erro ao confirmar a corrida.",
    });
  }
};
