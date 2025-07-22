import { Schema, model, Document } from "mongoose";

export interface IHorario extends Document {
  salon: string;
  day: string;
  inicioDate: Date;
  finDate: Date;
}

const HorarioSchema = new Schema<IHorario>({
  salon: { type: String, required: true },
  day: { type: String, required: true },
  inicioDate: { type: Date, required: true },
  finDate: { type: Date, required: true },
});

export const Horario = model<IHorario>("Horario", HorarioSchema);