import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlersumit = async () => {
    try {
      const values = form.getFieldsValue();
      console.log(values);

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      login(data.accessToken);
      navigate('/');
      form.resetFields();
    } catch (error) {
      console.log('Ocurrió un error en LoginForm.tsx: ', error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '##F2FDFD.',
      }}
    >
      {/* Logo */}
      <img
        src="https://alejandrone.mx/virtualtours/UTDVirtualTour/images/image_1.png" 
        style={{ width: 300, marginBottom: 20 }}
      />

      {/* Título */}
      <h2 style={{ marginBottom: 5, textAlign: 'center' }}>
        Sistema de Monitoreo de Aires Acondicionados 
      </h2>
      <p style={{ color: '#888', marginBottom: 30 }}>
        Inicia sesión 
      </p>

      {/* Formulario */}
      <Form
        form={form}
        name="login"
        layout="vertical"
        initialValues={{ remember: true }}
        style={{ width: '100%', maxWidth: 360 }}
      >
        <Form.Item
          label="Correo electrónico"
          name="username"
          rules={[{ required: true, message: 'Ingresa tu correo' }]}
        >
          <Input
            placeholder="Ingresa tu correo"
            prefix={<UserOutlined />}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
        >
          <Input.Password
            placeholder="Ingresa tu contraseña"
            prefix={<LockOutlined />}
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            block
            size="large"
            style={{
              backgroundColor: '#FFA726',
              borderColor: '#FFA726',
              fontWeight: 'bold',
            }}
            onClick={handlersumit}
          >
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;