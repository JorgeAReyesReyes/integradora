import { Request, Response } from "express";
import { Horario } from "../models/Horario";

// Obtener todos los horarios
export const getHorarios = async (req: Request, res: Response) => {
  try {
    const horario = await Horario.find();
    res.json(horario);
  } catch (error) {
    console.error('Error en getHorarios:', error);
    res.status(500).json({ error: "Error al obtener horarios" });
  }
};

// Crear un horario individual
export const createHorario = async (req: Request, res: Response) => {
  try {
    const nuevoHorario = new Horario(req.body);
    await nuevoHorario.save();
    res.status(201).json(nuevoHorario);
  } catch (error) {
    console.error('Error en createHorario:', error);
    res.status(500).json({ error: "Error al crear el horario" });
  }
};

// Actualizar un horario por ID
export const updateHorario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const horarioActualizado = await Horario.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(horarioActualizado);
  } catch (error) {
    console.error('Error en updateHorario:', error);
    res.status(500).json({ error: "Error al actualizar el horario" });
  }
};

// Eliminar un horario por ID
export const deleteHorario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Horario.findByIdAndDelete(id);
    res.json({ mensaje: "Horario eliminado correctamente" });
  } catch (error) {
    console.error('Error en deleteHorario:', error);
    res.status(500).json({ error: "Error al eliminar el horario" });
  }
};

// Eliminar todos los horarios de un salón
export const deleteHorariosPorSalon = async (req: Request, res: Response) => {
  try {
    const { salon } = req.params;
    await Horario.deleteMany({ salon });
    res.json({ mensaje: `Horarios del salón ${salon} eliminados` });
  } catch (error) {
    console.error('Error en deleteHorariosPorSalon:', error);
    res.status(500).json({ error: "Error al eliminar horarios por salón" });
  }
};

// Crear múltiples horarios para un salón
export const createHorariosPorSalon = async (req: Request, res: Response) => {
  try {
    const { salon } = req.params;
    const horarios = req.body;

    if (!Array.isArray(horarios)) {
      return res.status(400).json({ error: "Se esperaba un arreglo de horarios" });
    }

    const horariosConSalon = horarios.map((h: any) => ({ ...h, salon }));

    const horariosInsertados = await Horario.insertMany(horariosConSalon);

    res.status(201).json({
      mensaje: `Horarios insertados para el salón ${salon}`,
      horarios: horariosInsertados,
    });
  } catch (error) {
    console.error('Error en createHorariosPorSalon:', error);
    res.status(500).json({ error: "Error al crear horarios por salón" });
  }
};

// Reemplazar todos los horarios de un salón
export const guardarHorariosSalonCompleto = async (req: Request, res: Response) => {
  try {
    const { salon } = req.params;
    const nuevosHorarios = req.body;

    if (!Array.isArray(nuevosHorarios)) {
      return res.status(400).json({ error: "Se esperaba un arreglo de horarios" });
    }

    await Horario.deleteMany({ salon });

    const horariosConSalon = nuevosHorarios.map((h: any) => ({ ...h, salon }));

    const horariosInsertados = await Horario.insertMany(horariosConSalon);

    res.status(201).json({
      mensaje: `Horarios reemplazados para el salón ${salon}`,
      horarios: horariosInsertados,
    });
  } catch (error) {
    console.error('Error en guardarHorariosSalonCompleto:', error);
    res.status(500).json({ error: "Error al reemplazar horarios por salón" });
  }
};