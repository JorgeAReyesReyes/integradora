import React, { useEffect, useState } from 'react';
import { Button, Card, notification } from 'antd';
import axios from "axios";

interface RoomData {
  id: string;
  salon: string;
  estadoAire: 'Encendido' | 'Apagado';
  voltaje: string;
  estadoSalon: 'Ocupado' | 'Vacio';
  hasCommentButton: boolean;
  canEdit: boolean;
}

const Planta_baja: React.FC = () => {
  /** Datos “mock” */
  const [roomData, setRoomData] = useState<RoomData[]>([
    {
      id: '1',
      salon: 'C1',
      estadoAire: 'Apagado',
      voltaje: '43.46V',
      estadoSalon: 'Ocupado',
      hasCommentButton: true,
      canEdit: false,
    },
    {
      id: '2',
      salon: 'C2',
      estadoAire: 'Apagado',
      voltaje: '31.64V',
      estadoSalon: 'Vacio',
      hasCommentButton: false,
      canEdit: true,
    },
    {
      id: '3',
      salon: 'C3',
      estadoAire: 'Encendido',
      voltaje: '77.54V',
      estadoSalon: 'Ocupado',
      hasCommentButton: true,
      canEdit: false,
    },
    {
      id: '4',
      salon: 'C4',
      estadoAire: 'Encendido',
      voltaje: '83.45V',
      estadoSalon: 'Vacio',
      hasCommentButton: true,
      canEdit: false,
    },
    {
      id: '5',
      salon: 'C5',
      estadoAire: 'Encendido',
      voltaje: '58.47V',
      estadoSalon: 'Ocupado',
      hasCommentButton: true,
      canEdit: false,
    },
  ]);

  const [notificados, setNotificados] = useState<Set<string>>(new Set());

  useEffect(() => {
    roomData.forEach((room) => {
      const condicion =
        room.estadoAire === 'Encendido' && room.estadoSalon === 'Vacio';

      if (condicion && !notificados.has(room.id)) {
        // Mostrar notificación
        notification.warning({
          message: `A/C encendido en salón vacío`,
          description: `El salón ${room.salon} tiene el aire acondicionado encendido y está vacío.`,
          duration: 0,
        });

        // Registrar en el backend
        axios.post("/api/alertas", {
          salon: room.salon,
          mensaje: `El salón ${room.salon} tiene el aire acondicionado encendido y está vacío.`,
        }).catch((err) => {
          console.error("Error al registrar la alerta:", err);
        });

        // Añadir a set de notificados
        setNotificados((prev) => new Set(prev).add(room.id));
      }

      if (!condicion && notificados.has(room.id)) {
        setNotificados((prev) => {
          const copy = new Set(prev);
          copy.delete(room.id);
          return copy;
        });
      }
    });
  }, [roomData, notificados]);

  return (
    <div
      style={{
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '60px',
      }}
    >
      {/* Encabezado */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#fff',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 5px' }}>
          Monitoreo de Aire Acondicionado
        </h2>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'normal', margin: 0 }}>
          Planta Baja
        </h3>
      </div>

      {/* Cabecera de tabla */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr 1.5fr 1.5fr',
          gap: '8px',
          width: '95%',
          maxWidth: '700px',
          backgroundColor: '#ffa500',
          color: '#fff',
          padding: '12px 8px',
          borderRadius: '8px',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        <div>Salón</div>
        <div>Estado Aire</div>
        <div>Estado Salón</div>
        <div>Comentarios</div>
      </div>

      {/* Filas */}
      <div style={{ width: '95%', maxWidth: '700px', marginTop: '10px' }}>
        {roomData.map((room) => (
          <Card key={room.id} style={{ marginBottom: '8px', borderRadius: '8px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr 1.5fr 1.5fr',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{room.salon}</div>
              <div>
                <div style={{ color: room.estadoAire === 'Encendido' ? '#52c41a' : '#000' }}>
                  {room.estadoAire}
                </div>
                <small style={{ color: '#888' }}>{room.voltaje}</small>
              </div>
              <div>
                <span
                  style={{
                    color: room.estadoSalon === 'Ocupado' ? '#1890ff' : '#888',
                    fontWeight: 'bold',
                  }}
                >
                  {room.estadoSalon}
                </span>
              </div>
              <div>
                {room.hasCommentButton && (
                  <Button
                    size="small"
                    style={{
                      backgroundColor: '#8c8c8c',
                      borderColor: '#8c8c8c',
                      color: '#fff',
                    }}
                  >
                    Comentar
                  </Button>
                )}
                {room.canEdit && (
                  <Button size="small" type="primary" danger>
                    Editar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Planta_baja;