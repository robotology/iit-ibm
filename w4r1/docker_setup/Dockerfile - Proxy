FROM ubuntu:xenial

ARG ROOT_FOLDER=.

MAINTAINER Alessandro Faraotti <alessandro.faraotti@it.ibm.com>

RUN apt-get update
RUN echo '***** Installing basic packages *****'

#Add an util to run ping
RUN apt-get install -y iputils-ping 
RUN apt-get install -y wget

RUN apt-get install -y nfs-common python-tk portaudio19-dev libopencv-dev ntpdate vim ssh cmake-curses-gui iperf unzip


#Add www.icub.org to sources.list. Using xenial Linux distribution.
#RUN sh -c 'echo "deb http://www.icub.org/ubuntu xenial contrib/science" > /etc/apt/sources.list.d/icub.list'

#Import the repository public key
#RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 57A5ACB6110576A6

#Update the list of packages and install YARP
#RUN apt-get update
#RUN apt-get install -y yarp

#-------------------------
### SOX and NODE ###

RUN echo '***** Installing SOX *****'
#Install SOX
RUN apt-get install -y sox

RUN echo '***** Installing NODE *****'
#Install node
RUN apt-get install -y npm


RUN npm install -g n  
RUN n 8.15.0 				#NOTE: RUN n stable not working for yarpjs!

RUN apt-get purge -y nodejs #Remove an OLD nodejs (maybe installed with npm)

RUN echo '***** Checking NODE *****'
# Check NODE installation
#RUN nodejs --version
RUN npm --version
RUN echo '*************************'
#-------------------------

### APP Specific Starts below ###

RUN echo '***** Copying APP Files *****'
#Upload code for yarp yarpjs and w4r1
COPY $ROOT_FOLDER/yarp /app/yarp
COPY $ROOT_FOLDER/yarp.js /app/yarp.js
COPY $ROOT_FOLDER/iit-ibm/w4r1 /app/iit-ibm/w4r1
#-------------------------


### YARP ###
RUN echo '***** Installing YARP *****'
WORKDIR /app/yarp
RUN mkdir build
WORKDIR /app/yarp/build

RUN apt-get install -y cmake libace-dev
RUN cmake ..
RUN make
RUN make install 


# Check YARP installation
RUN yarp check


#---------------------------

#Install YarpJS
RUN echo '***** Installing YARP.JS *****'
WORKDIR /

RUN apt-get install -y libopencv-dev

RUN rm -rf app/yarp.js/package-lock.json
RUN npm install --prefix app/yarp.js
RUN app/yarp.js/node_modules/cmake-js/bin/cmake-js -d app/yarp.js
RUN echo '*************************'
#---------------------------

RUN echo '***** PREPARE W4R1 *****'
### W4R1 Specific ###

#Install ext
RUN echo '***** Compiling W4R1 EXT *****'
WORKDIR /app/iit-ibm/w4r1/ext
RUN pwd
RUN ./compile.sh
WORKDIR /

#Install w4r1
RUN echo '***** Installing W4R1 *****'
RUN npm install --prefix app/iit-ibm/w4r1

#Configure Yarp Server

#Uncomment following lines to autostart
#WORKDIR /app/iit-ibm/w4r1
#RUN npm start

CMD ["bash"]


#-------------------END----------------



#Upload w4r1 and yarpjs
#COPY $ROOT_FOLDER /app

#Clean w4r1 and yarpjs
#RUN rm -rf app/w4r1/yarp.js/build
#RUN rm -rf app/w4r1/yarp.js/node_modules
#RUN rm -rf app/w4r1/yarp.js/package-lock.json
#RUN rm -rf app/w4r1/node_modules
#RUN rm -rf app/w4r1/package-lock.json
#RUN rm -rf app/w4r1/ext/build

#Install YarpJS
#RUN npm install --prefix app/w4r1/yarp.js
#RUN app/w4r1/yarp.js/node_modules/cmake-js/bin/cmake-js -d app/w4r1/yarp.js

#Install ext
#WORKDIR /app/w4r1/ext
#RUN pwd
#RUN ./compile.sh
#WORKDIR /

#Install w4r1
#RUN npm install --prefix app/w4r1

#Configure Yarp Server

#Uncomment following lines to autostart
#WORKDIR /app/w4r1
#RUN npm start

#CMD ["bash"]

########## DOCS ################################
#
# TO BUILD EXECUTE
# docker build -t=w4r1_docker .
#
# TO START EXECUTE THE FOLLOWING COMMAND (add -it after run for an interactive session)
# -> TODO specify yarp server... 
# docker run w4r1_docker start.sh -prefix=app/w4r1
#
# OTHER USEFULL COMMANDS
# Enter the container
# docker exec -it <container id> /bin/bash
# List containers => docker ps -ad
# List images => docker image ls
###############################################
