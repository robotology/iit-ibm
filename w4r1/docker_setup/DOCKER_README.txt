Creare una cartella <rootfolder>

inizializzare GIT
git init

clonare i repository  

robotology/iit-ibm
robotology/yarp.js
randaz81/yarp

copiare il Dockerfile da iit-ibm/w4r1/Dockerfile
in <rootfolder>



 Build Command

* Type the command:

       docker build -t=w4r1_docker .

* Add environment variables:
    * Create a .bash_aliases
    * Add:
          export W4R1_YarpServerIp="xxx.xxx.xx.xxx"
          export W4R1_YarpServerPort="xxxxx"
          export W4R1_YarpNamespace="/namespace"
    * source .bash_aliases

* Run the docker image:
         docker run w4r1_docker /bin/bash -c "app/w4r1/start.sh"



#NOTES

* if when compiling the audioBufferData.h is not found add someting like the following in CMakeFilesList.txt
include_directories("../../../yarp/src/libYARP_dev/src/devices/msgs/yarp/include")
 