import React from 'react';
import { Form, Input, Button, message, Select, Switch } from 'antd';

const { Option } = Select;

const UserForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Formulario enviado:', values);
    message.success('Formulario enviado correctamente');
  };

  return (
    <div
      style={{
        height: '100%',
        minHeight: '100vh',
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
          maxWidth: 500,
          width: '100%',
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
        >
          <Input placeholder="Nombre" style={{ height: '45px' }} />
        </Form.Item>

        <Form.Item
          label="correo electronico"
          name="email"
          rules={[{ required: true, message: 'Por favor ingresa tu email' }]}
        >
          <Input placeholder="correo electronico" style={{ height: '45px' }} />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          hasFeedback
        >
          <Input.Password placeholder="Contraseña" style={{ height: '45px' }} />
        </Form.Item>

        <Form.Item
          label="Confirmar contraseña"
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

        <Form.Item
          label="Teléfono"
          name="phone"
          rules={[{ required: true, message: 'Por favor ingresa tu número de teléfono' }]}
        >
          <Input placeholder="Teléfono" style={{ height: '45px' }} />
        </Form.Item>

        <Form.Item
          label="Asignar un Rol"
          name="rolse"
          rules={[{ required: true, message: 'Selecciona al menos un rol' }]}
        >
          <Select
            mode="multiple"
            placeholder="Selecciona roles"
            style={{ width: '100%' }}
          >
            <Option value="admin">Administrador</Option>
            <Option value="user">Usuario</Option>
            <Option value="moderador">Moderador</Option>
          </Select>
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