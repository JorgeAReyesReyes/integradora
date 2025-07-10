import React, { useState } from 'react';
import { Layout, Typography, Table, Card, Button, Tag, Space, message,} from 'antd';

const { Content } = Layout;
const { Title } = Typography;

const dayOptions = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const timeSlots = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 7;
  const start = hour.toString().padStart(2, '0') + ':00';
  const end = (hour + 1).toString().padStart(2, '0') + ':00';
  return `${start} - ${end}`;
});
const salones = Array.from({ length: 14 }, (_, i) => `C${i + 1}`);

// Generar estructura vacía por salón
const generarDatosIniciales = () => {
  const datos: any = {};
  salones.forEach((salon) => {
    datos[salon] = timeSlots.map((slot) => {
      const fila: any = { key: slot, horario: slot };
      dayOptions.forEach((dia) => {
        fila[dia] = ''; // inicial vacío
      });
      return fila;
    });
  });
  return datos;
};

const HorarioForm: React.FC = () => {
  const [horarios, setHorarios] = useState(generarDatosIniciales);
  const [modoEdicion, setModoEdicion] = useState(false);

  const manejarClick = (salon: string, slot: string, dia: string) => {
    if (!modoEdicion) return;

    setHorarios((prev: any) => {
      const nuevos = { ...prev };
      nuevos[salon] = nuevos[salon].map((fila: any) =>
        fila.horario === slot
          ? { ...fila, [dia]: fila[dia] === 'Ocupado' ? '' : 'Ocupado' }
          : fila
      );
      return nuevos;
    });
  };

  const columnas = (salon: string) => [
    {
      title: 'Horario',
      dataIndex: 'horario',
      key: 'horario',
      fixed: 'left',
      width: 120,
    },
    ...dayOptions.map((dia) => ({
      title: dia,
      dataIndex: dia,
      key: dia,
      align: 'center' as const,
      render: (_: any, record: any) => {
        const valor = record[dia];
        return (
          <div
            style={{ cursor: modoEdicion ? 'pointer' : 'default' }}
            onClick={() => manejarClick(salon, record.horario, dia)}
          >
            {valor === 'Ocupado' ? (
              <Tag color="green">Ocupado</Tag>
            ) : (
              <div style={{ height: 24 }} />
            )}
          </div>
        );
      },
    })),
  ];

  const guardarCambios = () => {
    console.log('Datos a guardar:', horarios);
    message.success('Cambios guardados');
    setModoEdicion(false);
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '2rem',
      }}
    >
      <Content style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Title
          level={3}
          style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}
        >
          Horarios por salón
        </Title>

        {salones.map((salon) => (
          <Card
            key={salon}
            title={`Salón ${salon}`}
            style={{
              marginBottom: '2rem',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            bodyStyle={{ padding: '1rem' }}
          >
            <Table
              columns={columnas(salon)}
              dataSource={horarios[salon]}
              pagination={false}
              bordered
              scroll={{ x: 'max-content' }}
              size="middle"
            />
          </Card>
        ))}

        <Space
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 32,
            gap: '1rem',
          }}
        >
          <Button
            type="primary"
            onClick={() => setModoEdicion(!modoEdicion)}
            style={{
              width: 180,
              height: 45,
              fontSize: '1rem',
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
            }}
          >
            {modoEdicion ? 'Cancelar edición' : 'Editar'}
          </Button>

          <Button
            type="default"
            onClick={guardarCambios}
            disabled={!modoEdicion}
            style={{
              width: 180,
              height: 45,
              fontSize: '1rem',
              backgroundColor: '#52c41a',
              color: '#fff',
              borderColor: '#52c41a',
              opacity: modoEdicion ? 1 : 0.6,
              cursor: modoEdicion ? 'pointer' : 'not-allowed',
            }}
          >
            Guardar cambios
          </Button>
        </Space>
      </Content>
    </Layout>
  );
};

export default HorarioForm;