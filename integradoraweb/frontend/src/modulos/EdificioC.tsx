import { useEffect, useState } from 'react';
import { notification, Card, Select, Modal, Button, Input, List, Space, message } from 'antd';
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

interface CommentType {
  _id: string;
  texto: string;
  fecha: string;
}

const salonCoords: Record<string, { top: string; left: string }> = {
  // Planta alta
  C6: { top: '83%', left: '16%' },
  C7: { top: '78%', left: '30%' },
  C8: { top: '74%', left: '45%' },
  C9: { top: '69%', left: '59%' },
  C10: { top: '66%', left: '74%' },
  C11: { top: '27%', left: '68%' },
  C12: { top: '27%', left: '53%' },
  C13: { top: '27%', left: '38%' },
  C14: { top: '27%', left: '23%' },
  lab: { top: '30%', left: '87%' },
  // Planta baja
  C1: { top: '67%', left: '69%' },
  C2: { top: '27%', left: '64%' },
  C3: { top: '27%', left: '49%' },
  C4: { top: '27%', left: '33%' },
  C5: { top: '27%', left: '17%' },
};

const getColor = (estadoAire: string, estadoSalon: string) => {
  if (estadoAire === 'Encendido' && estadoSalon === 'Vacio') return 'red';
  if (estadoAire === 'Encendido' && estadoSalon === 'Ocupado') return 'green';
  return 'white';
};

const LegendTable = () => (
  <Card title="Código de colores" style={{ width: 300, marginLeft: '90px' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <div
        style={{
          width: 30,
          height: 20,
          borderRadius: '50%',
          backgroundColor: 'red',
          marginRight: 10,
          border: '1px solid #ccc',
        }}
      />
      <span>A/C encendido y salón vacío</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <div
        style={{
          width: 35,
          height: 25,
          borderRadius: '50%',
          backgroundColor: 'green',
          marginRight: 10,
          border: '1px solid #ccc',
        }}
      />
      <span>A/C encendido y salón ocupado</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: 'white',
          marginRight: 10,
          border: '1px solid #ccc',
        }}
      />
      <span>A/C apagado</span>
    </div>
  </Card>
);

const { Option } = Select;

const EdificioC = () => {
  const [roomData, setRoomData] = useState<RoomData[]>([]);
  const [plantaActual, setPlantaActual] = useState<'alta' | 'baja'>('alta');
  const [notificados, setNotificados] = useState<Set<string>>(new Set());

  const [comentarios, setComentarios] = useState<Record<string, CommentType[]>>({});
  const [comentarioOpen, setComentarioOpen] = useState(false);
  const [salonSeleccionado, setSalonSeleccionado] = useState<string | null>(null);
  const [nuevoComentarioTexto, setNuevoComentarioTexto] = useState("");

  // Modal para elegir salón al agregar comentario sin selección previa
  const [selectSalonModalOpen, setSelectSalonModalOpen] = useState(false);
  const [salonParaComentario, setSalonParaComentario] = useState<string | null>(null);

  // Base con todos los salones para asegurar visibilidad
  const salonesBase: Omit<
    RoomData,
    'estadoAire' | 'voltaje' | 'estadoSalon' | 'hasCommentButton' | 'canEdit'
  >[] = [
    { id: '1', salon: 'C6', planta: 'alta' },
    { id: '2', salon: 'C7', planta: 'alta' },
    { id: '3', salon: 'C8', planta: 'alta' },
    { id: '4', salon: 'C9', planta: 'alta' },
    { id: '5', salon: 'C10', planta: 'alta' },
    { id: '6', salon: 'C11', planta: 'alta' },
    { id: '7', salon: 'C12', planta: 'alta' },
    { id: '8', salon: 'C13', planta: 'alta' },
    { id: '9', salon: 'C14', planta: 'alta' },
    { id: '10', salon: 'lab', planta: 'alta' },
    { id: '11', salon: 'C1', planta: 'baja' },
    { id: '12', salon: 'C2', planta: 'baja' },
    { id: '13', salon: 'C3', planta: 'baja' },
    { id: '14', salon: 'C4', planta: 'baja' },
    { id: '15', salon: 'C5', planta: 'baja' },
  ];

  // Carga datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/horarios');

        const roomsConDatos: RoomData[] = salonesBase.map(({ id, salon, planta }) => {
          const dato = data.find((d: any) => d.salon === salon);

          // Planta baja modificaciones especiales:
          if (planta === 'baja') {
            if (salon === 'C1' || salon === 'C2') {
              return {
                id,
                salon,
                planta,
                estadoAire: 'Encendido',
                estadoSalon: 'Ocupado',
                voltaje: dato?.voltaje || 'N/A',
                hasCommentButton: true,
                canEdit: false,
              };
            }
            if (salon === 'C5') {
              return {
                id,
                salon,
                planta,
                estadoAire: 'Encendido',
                estadoSalon: 'Vacio',
                voltaje: dato?.voltaje || 'N/A',
                hasCommentButton: true,
                canEdit: false,
              };
            }
            // El resto blanco
            return {
              id,
              salon,
              planta,
              estadoAire: 'Apagado',
              estadoSalon: 'Vacio',
              voltaje: '0V',
              hasCommentButton: false,
              canEdit: false,
            };
          }

          // Planta alta y resto (igual que antes)
          if (!dato || dato.consumo === 0) {
            return {
              id,
              salon,
              planta,
              estadoAire: 'Apagado',
              estadoSalon: 'Vacio',
              voltaje: '0V',
              hasCommentButton: false,
              canEdit: false,
            };
          }

          if (salon === 'C4') {
            return {
              id,
              salon,
              planta,
              estadoAire: 'Encendido',
              estadoSalon: 'Vacio',
              voltaje: '83.45V',
              hasCommentButton: true,
              canEdit: false,
            };
          }

          return {
            id,
            salon,
            planta,
            estadoAire: dato.consumo > 0 ? 'Encendido' : 'Apagado',
            estadoSalon: dato.ocupado ? 'Ocupado' : 'Vacio',
            voltaje: dato.voltaje || 'N/A',
            hasCommentButton: true,
            canEdit: false,
          };
        });

        setRoomData(roomsConDatos);
      } catch (error) {
        console.error('Error al cargar datos:', error);

        const roomsDefault = salonesBase.map(({ id, salon, planta }) => ({
          id,
          salon,
          planta,
          estadoAire: 'Apagado',
          estadoSalon: 'Vacio',
          voltaje: '0V',
          hasCommentButton: false,
          canEdit: false,
        }));

        setRoomData(roomsDefault);
      }
    };

    fetchData();
  }, []);
// Cambios de color aleatorios cada 5 segundos
useEffect(() => {
  const interval = setInterval(() => {
    setRoomData(prev =>
      prev.map(room => {
        const estadosAire: RoomData['estadoAire'][] = ['Encendido', 'Apagado'];
        const estadosSalon: RoomData['estadoSalon'][] = ['Ocupado', 'Vacio'];

        const estadoAire = estadosAire[Math.floor(Math.random() * estadosAire.length)];
        const estadoSalon = estadosSalon[Math.floor(Math.random() * estadosSalon.length)];

        const voltaje = estadoAire === 'Encendido'
          ? `${(Math.random() * 120).toFixed(2)}V`
          : '0V';

        return {
          ...room,
          estadoAire,
          estadoSalon,
          voltaje,
        };
      })
    );
  }, 5000);

  return () => clearInterval(interval);
}, []);
  // Notificaciones para A/C encendido en salón vacío
  useEffect(() => {
    roomData.forEach((room) => {
      const alerta = room.estadoAire === 'Encendido' && room.estadoSalon === 'Vacio';

      if (alerta && !notificados.has(room.id)) {
        notification.warning({
  message: `A/C encendido en salón vacío`,
  description: `El salón ${room.salon} tiene el aire acondicionado encendido y está vacío.`,
  duration: 0,
  className: 'custom-notification',
});

        axios
          .post('http://localhost:3001/api/alertas', {
            salon: room.salon,
            mensaje: `El salón ${room.salon} tiene el aire acondicionado encendido y está vacío.`,
          })
          .catch((err) => {
            console.error('Error al registrar la alerta:', err);
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

  // Carga comentarios para salón seleccionado
  const cargarComentarios = async (salon: string) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/comentarios/${salon}`);
      setComentarios((prev) => ({ ...prev, [salon]: res.data.comentarios }));
    } catch (error) {
      console.error('Error al cargar comentarios', error);
      setComentarios((prev) => ({ ...prev, [salon]: [] }));
    }
  };

  // Abre modal comentarios para un salón (desde croquis o botón)
  const abrirModalComentarios = (salon: string) => {
    setSalonSeleccionado(salon);
    cargarComentarios(salon);
    setComentarioOpen(true);
  };

  // Renderiza imagen con marcadores interactivos
  const renderImageWithMarkers = (planta: 'alta' | 'baja', img: string) => {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '800px', border: '1px solid #ccc' }}>
          <img src={img} alt={`Croquis Planta ${planta}`} style={{ width: '800px', height: 'auto' }} />
          {roomData
            .filter((r) => r.planta === planta)
            .map((room) => {
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
                    cursor: 'pointer',
                  }}
                  onClick={() => abrirModalComentarios(room.salon)}
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

      <Space style={{ marginBottom: 16 }}>
        <Select
          value={plantaActual}
          onChange={setPlantaActual}
          style={{ width: 200 }}
          placeholder="Selecciona una planta"
          optionLabelProp="label"
        >
          <Option value="alta" label="Planta Alta">Planta Alta</Option>
          <Option value="baja" label="Planta Baja">Planta Baja</Option>
        </Select>

        <Button
          type="primary"
          onClick={() => {
            if (salonSeleccionado) {
              abrirModalComentarios(salonSeleccionado);
            } else {
              setSelectSalonModalOpen(true);
            }
          }}
        >
          Agregar comentario
        </Button>
      </Space>

      {plantaActual === 'alta' && renderImageWithMarkers('alta', plantaAlta)}
      {plantaActual === 'baja' && renderImageWithMarkers('baja', plantaBaja)}

      {/* Modal comentarios */}
      <Modal
        title={`Comentarios del salón ${salonSeleccionado}`}
        open={comentarioOpen}
        onCancel={() => setComentarioOpen(false)}
        footer={null}
      >
        <List
          dataSource={salonSeleccionado ? comentarios[salonSeleccionado] || [] : []}
          locale={{ emptyText: "No hay comentarios" }}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              actions={[
                <Button
                  danger
                  type="link"
                  onClick={async () => {
                    try {
                      await axios.delete(`http://localhost:3001/api/comentarios/${item._id}`);
                      cargarComentarios(salonSeleccionado!);
                    } catch (error) {
                      console.error("Error eliminando comentario", error);
                    }
                  }}
                >
                  Eliminar
                </Button>,
              ]}
            >
              {item.texto} <br />
              <small>{new Date(item.fecha).toLocaleString()}</small>
            </List.Item>
          )}
        />

        <Input.TextArea
          rows={3}
          value={nuevoComentarioTexto}
          onChange={(e) => setNuevoComentarioTexto(e.target.value)}
          placeholder="Escribe un nuevo comentario"
          style={{ marginTop: 16 }}
        />
        <Button
          type="primary"
          onClick={async () => {
            if (!nuevoComentarioTexto.trim()) {
              message.warning("Escribe un comentario antes de agregar");
              return;
            }
            try {
              await axios.post("http://localhost:3001/api/comentarios", {
                salon: salonSeleccionado,
                texto: nuevoComentarioTexto.trim(),
              });
              setNuevoComentarioTexto("");
              cargarComentarios(salonSeleccionado!);
            } catch (error) {
              console.error("Error agregando comentario", error);
            }
          }}
          style={{ marginTop: 8 }}
        >
          Agregar comentario
        </Button>
      </Modal>

      {/* Modal para elegir salón si no hay uno seleccionado */}
      <Modal
        title="Selecciona un salón para agregar comentario"
        open={selectSalonModalOpen}
        onCancel={() => setSelectSalonModalOpen(false)}
        onOk={() => {
          if (salonParaComentario) {
            setSelectSalonModalOpen(false);
            abrirModalComentarios(salonParaComentario);
            setSalonParaComentario(null);
          } else {
            message.warning("Debes seleccionar un salón");
          }
        }}
        okText="Aceptar"
        cancelText="Cancelar"
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Selecciona salón"
          value={salonParaComentario}
          onChange={setSalonParaComentario}
          options={salonesBase.map(({ salon }) => ({ label: salon, value: salon }))}
        />
      </Modal>
    </div>
  );
};

export default EdificioC;