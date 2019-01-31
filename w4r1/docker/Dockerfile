FROM ubuntu:xenial

### YARP ###
ARG W4R1_FOLDER=../

MAINTAINER Alessandro Faraotti <alessandro.faraotti@it.ibm.com>

RUN apt-get update

#Add an util to run ping
RUN apt-get install -y iputils-ping 

#Add www.icub.org to sources.list. Using xenial Linux distribution.
RUN sh -c 'echo "deb http://www.icub.org/ubuntu xenial contrib/science" > /etc/apt/sources.list.d/icub.list'

#Import the repository public key
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 57A5ACB6110576A6

#Update the list of packages and install YARP
RUN apt-get update && apt-get install -y yarp

#-------------------------
### SOX and NODE ###

#Install SOX
RUN apt-get install -y sox

#Install node
RUN apt-get install -y npm


RUN npm install -g n  
RUN n 8.15.0 				#NOTE: RUN n stable not working for yarpjs!

RUN apt-get purge -y nodejs #Remove an OLD nodejs (maybe installed with npm)


# Check YARP installation
RUN yarp check

# Check NODE installation
#RUN nodejs --version
RUN npm --version


#---------------------------
### W4R1 Specific ###

#Upload w4r1 and yarpjs
COPY $W4R1_FOLDER /app/w4r1

#Clean w4r1 and yarpjs
RUN rm -rf app/w4r1/yarp.js/build
RUN rm -rf app/w4r1/yarp.js/node_modules
RUN rm -rf app/w4r1/yarp.js/package-lock.json
RUN rm -rf app/w4r1/node_modules
RUN rm -rf app/w4r1/package-lock.json
RUN rm -rf app/w4r1/ext/build

#Install YarpJS
RUN npm install --prefix app/w4r1/yarp.js
RUN app/w4r1/yarp.js/node_modules/cmake-js/bin/cmake-js -d app/w4r1/yarp.js

#Install ext
WORKDIR /app/w4r1/ext
RUN pwd
RUN ./compile.sh
WORKDIR /

#Install w4r1
RUN npm install --prefix app/w4r1

#Configure Yarp Server
RUN yarp namespace $DEFAULT_YarpNamespace
RUN yarp conf $DEFAULT_YarpServerIp $DEFAULT_YarpServerPort

#Uncomment following lines to autostart
#WORKDIR /app/w4r1
#RUN npm start

CMD ["bash"]

########## DOCS ################################
#
# TO BUILD EXECUTE
# docker build -t=w4r1_docker --build-arg YARP_NAMESPACE=/root --build-arg YARP_SERVER_IP=127.0.0.1 --build-arg YARP_SERVER_PORT=10000 .
#
# TO START EXECUTE THE FOLLOWING COMMAND (add -it after run for an interactive session)
# -> TODO specify yarp server... 
# docker run w4r1_docker npm start -prefix=app/w4r1
#
# OTHER USEFULL COMMANDS
# Enter the container
# docker exec -it <container id> /bin/bash
# List containers => docker ps -ad
# List images => docker image ls
###############################################
