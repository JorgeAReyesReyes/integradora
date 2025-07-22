
from pyemvue import PyEmVue
from pyemvue.enums import Scale
from dotenv import load_dotenv
import os
from datetime import datetime
import time
import json

EMAIL = "softnova73@gmail.com"
PASSWORD = "1234567890"
DEVICE_GID = 464590
SCALE = "1S"
UNIT = "KilowattHours"

load_dotenv()

vue = PyEmVue()
vue.login(username=os.getenv("EMPORIA_USER"), password=os.getenv("EMPORIA_PASSWORD"))

devices = vue.get_devices()

device_id = int(os.getenv("EMPORIA_DEVICE_ID", "464590"))  # Usa variable de entorno o valor por defecto
channels = vue.get_device_channels(devices[0])

while True:
    now = datetime.utcnow()
    usage_data = vue.get_usage(device_gids=[device_id], instant=True)

    results = []
    for chan in usage_data[device_id].channels:
        # Buscar corriente (amperios) si está disponible
        amperios = None
        if chan.numerator_units and chan.numerator_vals:
            for unit, val in zip(chan.numerator_units, chan.numerator_vals):
                if unit.lower() == "a":
                    amperios = val

        result = {
            "timestamp": now.isoformat(),
            "device_gid": device_id,
            "channel_num": chan.channel_num,
            "channel_name": chan.name,
            "usage_kWh": chan.usage,
            "usage_W": chan.usage * 1000 if chan.usage is not None else 0,
            "percentage": chan.percentage,
            "current_A": amperios
        }
        results.append(result)

    print(json.dumps(results, indent=2))

    time.sleep(900)  # Espera 15 minutos