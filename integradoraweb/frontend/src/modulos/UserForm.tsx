import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, Table, Popconfirm, Modal } from 'antd';
import axios from 'axios';

const { Option } = Select;

interface UserData {
  key: string;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  status?: boolean;
}

const UserForm: React.FC = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const isEditing = !!editingUser;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      const data = response.data.userList;

      if (!Array.isArray(data)) {
        throw new Error("La respuesta no contiene un arreglo de usuarios");
      }

      const formattedUsers: UserData[] = data.map((user: any) => ({
        key: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: Array.isArray(user.roles)
          ? user.roles.map((r: any) => r.name || r)
          : [user.roles],
        status: user.status ?? true,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      message.error("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.roles,
      };

      if (isEditing && editingUser) {
        await axios.patch(`${API_URL}/api/users/${editingUser.key}`, payload);
        message.success("Usuario actualizado correctamente");
      } else {
        await axios.post(`${API_URL}/api/users`, payload);
        message.success("Usuario registrado correctamente");
      }

      form.resetFields();
      setEditingUser(null);
      fetchUsers();
      setIsModalVisible(false);
    } catch (error: any) {
      console.error("Error al guardar:", error.response?.data || error);
      message.error("Error al guardar usuario");
    }
  };

  const handleDisableUser = async (key: string) => {
    try {
      await axios.patch(`${API_URL}/api/users/${key}/disable`);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.key === key ? { ...user, status: false } : user
        )
      );
      message.success("Usuario dado de baja correctamente");
    } catch (error) {
      console.error(error);
      message.error("Error al dar de baja el usuario");
    }
  };

  const handleEditUser = (key: string) => {
    const userToEdit = users.find(user => user.key === key);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setIsModalVisible(true);
      form.setFieldsValue({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        roles: userToEdit.roles,
        password: '',
        confirmPassword: '',
      });
    }
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Correo', dataIndex: 'email', key: 'email' },
    { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean | undefined) =>
        status === false ? (
          <span style={{ color: 'red' }}>Inactivo</span>
        ) : (
          <span style={{ color: 'green' }}>Activo</span>
        ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: UserData) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" onClick={() => handleEditUser(record.key)}>Editar</Button>
          {record.status !== false && (
            <Popconfirm
              title="¿Estás seguro de dar de baja a este usuario?"
              onConfirm={() => handleDisableUser(record.key)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="link" danger>Dar de baja</Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2 style={{ marginBottom: '2rem', color: '#333' }}>
        Gestión de Usuarios
      </h2>

      <div style={{ width: '100%', maxWidth: 800 }}>
        <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={() => {
              setIsModalVisible(true);
              setEditingUser(null);
              form.resetFields();
            }}
            style={{ backgroundColor: '#ffa500', borderColor: '#ffa500' }}
          >
            Ingresar Nuevo Usuario
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          pagination={{ pageSize: 5 }}
        />
      </div>

      <Modal
        title={isEditing ? "Editar Usuario" : "Registrar Nuevo Usuario"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
          >
            <Input placeholder="Nombre" style={{ height: '45px' }} />
          </Form.Item>

          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu email' },
              { type: 'email', message: 'Ingresa un correo válido' },
            ]}
          >
            <Input placeholder="Correo electrónico" style={{ height: '45px' }} />
          </Form.Item>

          {!isEditing && (
            <>
              <Form.Item
                label="Contraseña"
                name="password"
                rules={[{ required: true, message: 'Ingresa una contraseña con al menos ocho caracteres, mayúsculas y dígitos' }]}
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
                      if (!value || getFieldValue('password') === value) return Promise.resolve();
                      return Promise.reject(new Error('¡Las contraseñas no coinciden!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirmar contraseña" style={{ height: '45px' }} />
              </Form.Item>
            </>
          )}

          <Form.Item
            label="Teléfono"
            name="phone"
            rules={[{ required: true, message: 'Por favor ingresa tu número de teléfono' }]}
          >
            <Input placeholder="Teléfono" style={{ height: '45px' }} />
          </Form.Item>

          <Form.Item
            label="Asignar un Rol"
            name="roles"
            rules={[{ required: true, message: 'Selecciona al menos un rol' }]}
          >
            <Select mode="multiple" placeholder="Selecciona roles" style={{ width: '100%' }}>
              <Option value="admin">Administrador</Option>
              <Option value="user">Usuario</Option>
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
              {isEditing ? "Actualizar Usuario" : "Registrar Usuario"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserForm;