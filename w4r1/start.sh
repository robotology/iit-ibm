echo "***** Starting W4R1 *****"
echo "-> Configuring Yarp"

if [[ -z "${W4R1_YarpServerIp}" ]]; then
  YARP_SERVER_IP="127.0.0.1"
  echo Enviromnet variable W4R1_YarpServerIp not set using default
else
  YARP_SERVER_IP="${W4R1_YarpServerIp}"
fi


if [[ -z "${W4R1_YarpServerPort}" ]]; then
  YARP_SERVER_PORT="10000"
  echo Enviromnet variable W4R1_YarpServerPort not set using default
else
  YARP_SERVER_PORT="${W4R1_YarpServerPort}"
fi

if [[ -z "${W4R1_YarpNamespace}" ]]; then
  YARP_NAMESPACE="/root"
  echo Enviromnet variable W4R1_YarpNamespace not set using default
else
  YARP_NAMESPACE="${W4R1_YarpNamespace}"
fi

echo "* YARP_SEVER_IP:    " ${YARP_SERVER_IP}
echo "* YARP_SERVER_PORT: " ${YARP_SERVER_PORT}
echo "* YARP_NAMESPACE:   " ${YARP_NAMESPACE}

yarp namespace ${YARP_NAMESPACE}
yarp conf ${YARP_SERVER} ${YARP_PORT}

echo "-> Done"
echo "-> Starting W4R1"
npm start -prefix /app/w4r1
