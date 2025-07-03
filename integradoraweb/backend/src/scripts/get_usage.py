from pyemvue import PyEmVue
from datetime import datetime, timezone
import json
import time

# ========================================
# CONFIGURACIÓN
# ========================================
EMAIL = "softnova73@gmail.com"
PASSWORD = "1234567890"
DEVICE_GID = 464590
SCALE = "1S"
UNIT = "KilowattHours"

# ========================================
# FUNCIÓN PRINCIPAL
# ========================================
def obtener_datos():
    vue = PyEmVue()
    datos_a_guardar = []

    try:
        vue.login(EMAIL, PASSWORD)

        now = datetime.now(timezone.utc)

        result = vue.get_device_list_usage(
            deviceGids=[DEVICE_GID],
            instant=now,
            scale=SCALE,
            unit=UNIT
        )

        for device_gid, device in result.items():
            for channel_num, channel in device.channels.items():
                uso_kWh = channel.usage or 0
                uso_W = uso_kWh * 1000 * 3600

                datos_a_guardar.append({
                    "timestamp": now.isoformat(),
                    "device_gid": device_gid,
                    "channel_num": channel_num,
                    "channel_name": channel.name,
                    "usage_kWh": uso_kWh,
                    "usage_W": uso_W,
                    "percentage": channel.percentage
                })

        # Solo imprime JSON
        print(json.dumps(datos_a_guardar))

    except Exception as e:
        # Imprime error como JSON para facilitar manejo desde Node.js
        print(json.dumps({ "error": str(e) }))

# ========================================
# BUCLE INFINITO CADA 15 MIN
# ========================================
if __name__ == "__main__":
    while True:
        obtener_datos()
        time.sleep(900)  # Espera 15 minutos (900 segundos)