import { useEffect, useState } from 'react';
import { notification, Card } from 'antd';
import axios from 'axios';
import plantaAlta from '../assets/planta_alta.png';
import plantaBaja from '../assets/planta_baja.png';



interface RoomData {
  id: string;
  salon: string;
  estadoAire: 'Encendido' | 'Apagado';
  voltaje: string;
  estadoSalon: 'Ocupado' | 'Vacio';
  hasCommentButton: boolean;
  canEdit: boolean;
  planta: 'alta' | 'baja';
}

const salonCoords: Record<string, { top: string; left: string }> = {
  // Planta alta
  C6: { top: '82%', left: '11%' },
  C7: { top: '77%', left: '25%' },
  C8: { top: '72%', left: '40%' },
  C9: { top: '67%', left: '55%' },
  C10: { top: '63%', left: '70%' },
  C11: { top: '20%', left: '66%' },
  C12: { top: '20%', left: '50%' },
  C13: { top: '20%', left: '33%' },
  C14: { top: '20%', left: '19%' },
  // Planta baja
  C1: { top: '67%', left: '69%' },
  C2: { top: '25%', left: '64%' },
  C3: { top: '25%', left: '49%' },
  C4: { top: '25%', left: '32%' },
  C5: { top: '25%', left: '17%' },
};

const getColor = (estadoAire: string, estadoSalon: string) => {
  if (estadoAire === 'Encendido' && estadoSalon === 'Vacio') return 'red';
  if (estadoAire === 'Encendido'&& estadoSalon === 'Ocupado' ) return 'green';
  return 'white';
};

const LegendTable = () => (
  <Card title="codigo de colores" style={{ width: 300, marginLeft: '90px' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <div style={{ width: 30, height: 20, borderRadius: '50%', backgroundColor: 'red', marginRight: 10, border: '1px solid #ccc' }} />
      <span>A/C encendido y salón vacío</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <div style={{ width: 35, height: 25, borderRadius: '50%', backgroundColor: 'green', marginRight: 10, border: '1px solid #ccc' }} />
      <span>A/C encendido y salón ocupado</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'white', marginRight: 10, border: '1px solid #ccc' }} />
      <span>A/C apagado</span>
    </div>
  </Card>
);

const EdificioC = () => {
  const [roomData, setRoomData] = useState<RoomData[]>([
    // Planta alta
    { id: '1', salon: 'C6', estadoAire: 'Apagado', voltaje: '43.46V', estadoSalon: 'Ocupado', hasCommentButton: true, canEdit: false, planta: 'alta' },
    { id: '2', salon: 'C7', estadoAire: 'Apagado', voltaje: '43.46V', estadoSalon: 'Ocupado', hasCommentButton: true, canEdit: false, planta: 'alta' },
    { id: '3', salon: 'C8', estadoAire: 'Apagado', voltaje: '31.64V', estadoSalon: 'Vacio', hasCommentButton: false, canEdit: true, planta: 'alta' },
    { id: '4', salon: 'C9', estadoAire: 'Encendido', voltaje: '77.54V', estadoSalon: 'Ocupado', hasCommentButton: true, canEdit: false, planta: 'alta' },
    { id: '5', salon: 'C10', estadoAire: 'Encendido', voltaje: '83.45V', estadoSalon: 'Vacio', hasCommentButton: true, canEdit: false, planta: 'alta' },
    { id: '6', salon: 'C11', estadoAire: 'Encendido', voltaje: '58.47V', estadoSalon: 'Ocupado', hasCommentButton: true, canEdit: false, planta: 'alta' },
    { id: '7', salon: 'C12', estadoAire: 'Encendido', voltaje: '58.47V', estadoSalon: 'Ocupado', hasCommentButton: true, canEdit: false, planta: 'alta' },
    { id: '8', salon: 'C13', estadoAire: 'Encendido', voltaje: '58.47V', estadoSalon: 'Ocupado', hasCommentButton: true, canEdit: false, planta: 'alta' },
    { id: '9', salon: 'C14', estadoAire: 'Encendido', voltaje: '58.47V', estadoSalon: 'Ocupado', hasCommentButton: true, canEdit: false, planta: 'alta' },
    // Planta baja
    { id: '10', salon: 'C1', estadoAire: 'Apagado', voltaje: '43.46V', estadoSalon: 'Ocupado', hasCommentButton: true, canEdit: false, planta: 'baja' },
    { id: '11', salon: 'C2', estadoAire: 'Apagado', voltaje: '31.64V', estadoSalon: 'Vacio', hasCommentButton: false, canEdit: true, planta: 'baja' },
    { id: '12', salon: 'C3', estadoAire: 'Encendido', voltaje: '77.54V', estadoSalon: 'Ocupado', hasCommentButton: true, canEdit: false, planta: 'baja' },
    { id: '13', salon: 'C4', estadoAire: 'Encendido', voltaje: '83.45V', estadoSalon: 'Vacio', hasCommentButton: true, canEdit: false, planta: 'baja' },
    { id: '14', salon: 'C5', estadoAire: 'Encendido', voltaje: '58.47V', estadoSalon: 'Ocupado', hasCommentButton: true, canEdit: false, planta: 'baja' },
  ]);

  const [notificados, setNotificados] = useState<Set<string>>(new Set());

  useEffect(() => {
    roomData.forEach((room) => {
      const alerta = room.estadoAire === 'Encendido' && room.estadoSalon === 'Vacio';

      if (alerta && !notificados.has(room.id)) {
        notification.warning({
          message: `A/C encendido en salón vacío`,
          description: `El salón ${room.salon} tiene el aire acondicionado encendido y está vacío.`,
          duration: 0,
        });

        axios.post("/api/alertas", {
          salon: room.salon,
          mensaje: `El salón ${room.salon} tiene el aire acondicionado encendido y está vacío.`,
        }).catch((err) => {
          console.error("Error al registrar la alerta:", err);
        });

        setNotificados((prev) => new Set(prev).add(room.id));
      }

      if (!alerta && notificados.has(room.id)) {
        setNotificados((prev) => {
          const copy = new Set(prev);
          copy.delete(room.id);
          return copy;
        });
      }
    });
  }, [roomData, notificados]);

  const renderImageWithMarkers = (planta: 'alta' | 'baja', img: string) => {

    return (

      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '800px', border: '1px solid #ccc' }}>
          <img
            src={img}
            alt={`Croquis Planta ${planta}`}
            style={{ width: '800px', height: 'auto', display: 'block' }}
          />
          {roomData.filter(r => r.planta === planta).map((room) => {
            const coords = salonCoords[room.salon];
            if (!coords) return null;
            const color = getColor(room.estadoAire, room.estadoSalon);

            return (
              <div
                key={room.id}
                title={`Salón ${room.salon}`}
                style={{
                  position: 'absolute',
                  top: coords.top,
                  left: coords.left,
                  transform: 'translate(-50%, -50%)',
                  width: '45px',
                  height: '45px',
                  backgroundColor: color,
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                  zIndex: 10,
                }}
              />
            );
          })}
        </div>
        <LegendTable />
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Monitoreo de Aire Acondicionado</h2>

      <h3 style={{ fontSize: '1.3rem', fontWeight: 'normal', marginBottom: '10px' }}>Planta Alta</h3>
      {renderImageWithMarkers('alta', plantaAlta)}

      <h3 style={{ fontSize: '1.3rem', fontWeight: 'normal', marginBottom: '10px' }}>Planta Baja</h3>
      {renderImageWithMarkers('baja', plantaBaja)}
    </div>
  );
};



export default EdificioC;