import { Document, model, Schema, Types } from "mongoose";


export interface IHorario extends Document {
  _id: Types.ObjectId;   
  salon: string;         // Ej. “c1”
  day: string;           // Ej. “Lunes”  
  inicioDate: Date;      //hora de inicio
  finDate: Date;         // hora de fin
}

const HorarioSchema = new Schema<IHorario>(
  {
    salon: {
      type: String,
      required: true,
      trim: true,
    },
    day: {
      type: String,
      required: true,
      trim: true,
    
    },
    inicioDate: {
      type: Date,
      required: true,
    },
    finDate: {
      type: Date,
      required: true,
    },
  }
);
export const Horario = model<IHorario>("Horario", HorarioSchema);