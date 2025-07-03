import { Router } from "express";
import {deleteUser,updateUser,getAllUsers,getTimeToken,getUsersByusername,login,saveUser,updateToken,} from "../controllers/auth.controller";
import { actualizarDatos } from "../controllers/emporia.controller";
import {getHorarios,getHorarioById,createHorario, updateHorario, deleteHorario,} from "../controllers/horario.controller";
import { crearAlerta, getHistorialAlertas } from "../controllers/alerta_controller";

const router = Router();

// Alertas  
router.post("/alertas", crearAlerta);
router.get("/alertas", getHistorialAlertas);

//  Auth  
router.post("/login", login);
router.get("/getTime/:userId", getTimeToken);
router.patch("/update/:userId", updateToken);

router.get("/users", getAllUsers);
router.post("/users", saveUser);
router.get("/users/name/:userName", getUsersByusername);
router.patch("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

// Datos Emporia  
router.get("/datos/actualizar", actualizarDatos);

// Horarios  
router.get("/horarios", getHorarios);           
router.get("/horarios/:id", getHorarioById);     
router.post("/horarios", createHorario);        
router.put("/horarios/:id", updateHorario);      
router.delete("/horarios/:id", deleteHorario);   

export default router;