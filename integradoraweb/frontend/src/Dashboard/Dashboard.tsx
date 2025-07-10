import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  CommentOutlined,
  AlertOutlined,
  DatabaseOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{ backgroundColor: "#006400" }} // Verde UTD
      >
        <div
          style={{
            height: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
          }}
        >
          <img
            src="https://alejandrone.mx/virtualtours/UTDVirtualTour/images/image_1.png"
            alt="UTD"
            style={{ maxHeight: 110 }} 
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          onClick={({ key }) => navigate(key)}
          style={{ backgroundColor: "#006400" }} 
          items={[
           
            { key: "/users",
               icon: <UserOutlined />,
                label: "Usuarios" 
              },
            
            { key: "/comment", 
              icon: <CommentOutlined />,
               label: "Comentarios" 
              },
            { key: "/alerts", 
              icon: <AlertOutlined />,
               label: "Alertas"
               },
            { key: "/horarioform", 
              icon: <DatabaseOutlined />,
               label: "Horarios"
               },

               { key: "/EdificioC", 
              icon: <HomeOutlined />,
               label: "Monitoreo"
               },

                { key: "/DatosEmporia", 
              icon: <DatabaseOutlined />,
               label: "consumo "
               },
          ]}
        />
      </Sider>

      <Layout>
        <Content style={{ margin: 0, padding: 24, background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;