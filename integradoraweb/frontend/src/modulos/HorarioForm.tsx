import React, { useState } from 'react';
import { Form, Button, Select, TimePicker, message, Layout, Typography } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Content } = Layout;
const { Title } = Typography;

const dayOptions = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const salones = Array.from({ length: 14 }, (_, i) => `C${i + 1}`);

const HorarioForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const [inicio, fin] = values.horario;
    setLoading(true);
    try {
      await axios.post('/api/horarios', {
        salon: values.salon.trim(),
        day: values.day,
        inicioDate: inicio.toISOString(),
        finDate: fin.toISOString(),
      });
      message.success('Horario registrado correctamente');
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Error al registrar el horario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5', padding: 24 }}>
      <Content style={{ maxWidth: 600, margin: '0 auto' }}>
        <div
          style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Title level={4} style={{ textAlign: 'center' }}>
            Registrar  Horario
          </Title>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={<strong>Salón</strong>}
              name="salon"
              rules={[{ required: true, message: 'Selecciona un salón' }]}
            >
              <Select placeholder="Selecciona un salón" style={{ height: '45px' }}>
                {salones.map((salon) => (
                  <Option key={salon} value={salon}>
                    {salon}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<strong>Día</strong>}
              name="day"
              rules={[{ required: true, message: 'Selecciona un día' }]}
            >
              <Select placeholder="Selecciona un día" style={{ height: '45px' }}>
                {dayOptions.map((d) => (
                  <Option key={d} value={d}>
                    {d}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<strong>Horario</strong>}
              name="horario"
              rules={[{ required: true, message: 'Selecciona el horario' }]}
            >
             <TimePicker.RangePicker
  format="HH:mm"
  style={{ width: '100%' }}
  minuteStep={60}
  disabledMinutes={() => Array.from({ length: 60 }, (_, i) => i).filter((m) => m !== 0)}
  disabledHours={() => [
    ...Array.from({ length: 7 }, (_, i) => i),     // 00–06
    ...Array.from({ length: 2 }, (_, i) => i + 22) // 22–23
  ]}
/>
             
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  height: '50px',
                  fontSize: '1.2rem',
                  backgroundColor: '#ffa500',
                  borderColor: '#ffa500',
                  boxShadow: '0 2px 8px rgba(255,165,0,0.3)',
                }}
              >
                Registrar Horario
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default HorarioForm;