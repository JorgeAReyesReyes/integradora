import { Schema, model, Document } from "mongoose";

export interface IDatos extends Document {
  timestamp: Date;
  device_gid: number;
  channel_num: number;
  channel_name: string;
  usage_kWh: number;
  usage_W: number;
  percentage: number;
}

const datosSchema = new Schema<IDatos>({
  timestamp: {
    type: Date,
    required: true 
  },
  device_gid: {
    type: Number,
    required: true,
    min: [1, 'El ID del dispositivo debe ser un número positivo.']
  },
  channel_num: {
    type: Number,
    required: true,
    min: [1, 'El número de canal debe ser un número positivo.']
  },
  channel_name: {
    type: String,
    required: true
  },
  usage_kWh: {
    type: Number,
    required: true,
    // ¡CAMBIO AQUÍ! Asegura que usage_kWh sea estrictamente mayor que 1
    min: [1.0001, 'El uso en kWh debe ser superior a 1.']
  },
  usage_W: {
    type: Number,
    required: true,
    // ¡CAMBIO AQUÍ! Asegura que usage_W sea estrictamente mayor que 1
    min: [1.0001, 'El uso en W debe ser superior a 1.']
  },
  percentage: {
    type: Number,
    required: true,
    min: [0, 'El porcentaje no puede ser negativo.'],
    max: [100, 'El porcentaje no puede exceder 100.']
  },
});

export const Datos = model<IDatos>("Datos", datosSchema);