import React, { useEffect, useState } from "react";
import { Table, Typography, Card, Space, Tag } from "antd";

const { Title } = Typography;

interface DatoEnergia {
  _id: string;
  timestamp: string;
  device_gid: number;
  channel_num: number;
  channel_name: string;
  usage_kWh: number;
  usage_W: number;
  percentage: number;
}

const generarDatoAleatorio = (channelNum: number): DatoEnergia => {
  const usage_W = parseFloat((Math.random() * 2000).toFixed(2));
  const usage_kWh = parseFloat(((usage_W / 1000) * (1 / 60)).toFixed(4));
  const percentage = parseFloat((Math.random() * 100).toFixed(1));

  return {
    _id: `${channelNum}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    device_gid: 464590,
    channel_num: channelNum,
    channel_name: `Canal ${channelNum}`,
    usage_kWh,
    usage_W,
    percentage,
  };
};

const DatosEmporia: React.FC = () => {
  const [datos, setDatos] = useState<DatoEnergia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const datosGenerados = Array.from({ length: 11 }, (_, i) =>
        generarDatoAleatorio(i + 1)
      );
      setDatos(datosGenerados);
      setLoading(false);
    }, 1000);
  }, []);

  const columnas = [
    {
      title: "Canal",
      dataIndex: "channel_name",
      key: "channel_name",
      sorter: (a: DatoEnergia, b: DatoEnergia) =>
        a.channel_num - b.channel_num,
    },
    {
      title: "Fecha",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (fecha: string) => new Date(fecha).toLocaleString(),
      sorter: (a: DatoEnergia, b: DatoEnergia) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
    {
      title: "kWh",
      dataIndex: "usage_kWh",
      key: "usage_kWh",
      sorter: (a: DatoEnergia, b: DatoEnergia) => a.usage_kWh - b.usage_kWh,
    },
    {
      title: "Watt",
      dataIndex: "usage_W",
      key: "usage_W",
      sorter: (a: DatoEnergia, b: DatoEnergia) => a.usage_W - b.usage_W,
    },
    {
      title: "%",
      dataIndex: "percentage",
      key: "percentage",
      render: (valor: number) => (
        <Tag color={valor > 75 ? "red" : valor > 50 ? "orange" : "green"}>
          {valor}%
        </Tag>
      ),
      sorter: (a: DatoEnergia, b: DatoEnergia) => a.percentage - b.percentage,
    },
  ];

  return (
    <Card
      styles={{
        body: {
          margin: "20px",
        },
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={3}>Consumo de energía</Title>
        <Table
          dataSource={datos}
          columns={columnas}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 11 }}
        />
      </Space>
    </Card>
  );
};

export default DatosEmporia;