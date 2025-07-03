import { Request, Response } from "express";
import { Horario } from "../models/Horarios";
import { isValidObjectId } from "mongoose";


// GET /api/horarios                        → listar todos
export const getHorarios = async (_req: Request, res: Response) => {
  const horarios = await Horario.find().sort({ inicioDate: 1 });
  res.json(horarios);
};

// detalle
export const getHorarioById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    return res.status(400).json({ message: "ID no válido" });

  const horario = await Horario.findById(id);
  if (!horario) return res.status(404).json({ message: "No encontrado" });

  res.json(horario);
};

// crear
export const createHorario = async (req: Request, res: Response) => {
  const { salon, day, inicioDate, finDate } = req.body;

  try {
    const nuevo = await Horario.create({ salon, day, inicioDate, finDate });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ message: "Error al crear", details: err });
  }
};

// actualizar
export const updateHorario = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    return res.status(400).json({ message: "ID no válido" });

  try {
    const actualizado = await Horario.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!actualizado)
      return res.status(404).json({ message: "No encontrado" });

    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ message: "Error al actualizar", details: err });
  }
};

//eliminar
export const deleteHorario = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    return res.status(400).json({ message: "ID no válido" });

  const eliminado = await Horario.findByIdAndDelete(id);
  if (!eliminado) return res.status(404).json({ message: "No encontrado" });

  res.json({ message: "Horario eliminado" });
};