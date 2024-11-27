import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const ridesController = async (req: Request,  res: Response): Promise<Response | void> => {
  const { customer_id } = req.params;
  const { driver_id } = req.query;

  if (!customer_id) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "O ID do cliente é obrigatório.",
    });
  }

  try {
    //filtro de consulta
    //clasula de condição
    const whereClause: any = {
      customerId: customer_id,
    };

    if (driver_id) {
      const driverExists = await prisma.driver.findUnique({
        where: { id: Number(driver_id) },
      });

      if (!driverExists) {
        return res.status(400).json({
          error_code: "INVALID_DRIVER",
          error_description: "O ID do motorista fornecido é inválido.",
        });
      }

      whereClause.driverId = Number(driver_id);
    }

    const rides = await prisma.ride.findMany({
      where: whereClause,
      include: {
        driver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (rides.length === 0) {
      return res.status(404).json({
        error_code: "NO_RIDES_FOUND", //rides viagem
        error_description: "Nenhuma viagem encontrada.",
      });
    }

    return res.status(200).json({
      customer_id,
      rides: rides.map((ride) => ({
        id: ride.id,
        date: ride.createdAt,
        origin: ride.origin,
        destination: ride.destination,
        distance: ride.distance,
        duration: ride.duration,
        driver: {
          id: ride.driver.id,
          name: ride.driver.name,
        },
        value: ride.value,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Ocorreu um erro ao buscar viagens.",
    });
  }
};
