import cron from "node-cron";
import { actualizarDatos } from "../controllers/emporia.controller";
import express, { Request, Response } from "express";

// Simulamos Request y Response vacíos
const fakeReq = {} as Request;
const fakeRes = {
  status: () => ({
    json: (data: any) => console.log("⏱️ Job ejecutado:", data),
  }),
} as unknown as Response;

export const iniciarJobEmporia = () => {
  // Ejecuta cada 15 minutos
  cron.schedule("*/15 * * * *", () => {
    console.log("⏳ Ejecutando actualización automática de datos Emporia...");
    actualizarDatos(fakeReq, fakeRes);
  });
};