import React from 'react';
import { Form, Input, Button, message } from 'antd';

const UserForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Formulario enviado:', values);
    message.success('Formulario enviado correctamente');
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
        paddingTop: '2rem',
      }}
    >
      <h2 style={{ marginBottom: '2rem', color: '#333', fontSize: '1.8rem' }}>
        Registrar Nuevo Usuario
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{
          maxWidth: 400,
          width: '100%',
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Form.Item
          label={<span style={{ fontWeight: 'bold' }}>Nombre completo</span>}
          name="fullName"
          rules={[{ required: true, message: 'Por favor ingresa tu nombre completo' }]}
        >
          <Input placeholder="Nombre completo" style={{ height: '45px' }} />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 'bold' }}>Nombre de usuario</span>}
          name="username"
          rules={[{ required: true, message: 'Por favor ingresa tu nombre de usuario' }]}
        >
          <Input placeholder="Nombre de usuario" style={{ height: '45px' }} />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 'bold' }}>Contraseña</span>}
          name="password"
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          hasFeedback
        >
          <Input.Password placeholder="Contraseña" style={{ height: '45px' }} />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 'bold' }}>Confirmar contraseña</span>}
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor confirma tu contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('¡Las contraseñas no coinciden!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirmar contraseña" style={{ height: '45px' }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              height: '50px',
              fontSize: '1.2rem',
              backgroundColor: '#ffa500',
              borderColor: '#ffa500',
              boxShadow: '0 2px 8px rgba(255,165,0,0.3)',
            }}
          >
            Registrar Usuario
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserForm;