import { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import { Datos } from "../models/Datos";

export const actualizarDatos = async (_req: Request, res: Response) => {
  const scriptPath = path.join(__dirname, "..", "scripts", "get_usage.py");
  const python = spawn("python", [scriptPath]);

  let dataOutput = "";

  python.stdout.on("data", (data) => {
    dataOutput += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error("Error de Python:", data.toString());
  });

  python.on("close", async (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: "Error al ejecutar el script Python", code });
    }

    try {
      const datos = JSON.parse(dataOutput);

      // Convertir timestamp a Date
      datos.forEach((d: any) => {
        d.timestamp = new Date(d.timestamp);
      });

      // Insertar en BD
      const inserted = await Datos.insertMany(datos);

      // Log consola
      console.log("Datos recibidos desde Emporia:");
      inserted.forEach((d, i) => {
        console.log(`  ${i + 1}. Canal ${d.channel_name}: ${d.usage_W.toFixed(2)} W`);
      });

      return res.status(200).json({
        message: "Datos insertados con éxito",
        registros: inserted.length,
        datos: inserted,
      });
    } catch (error) {
      console.error("Error al parsear o guardar:", error);
      return res.status(500).json({ message: "Error al procesar los datos", error });
    }
  });
};