
<a name='example-inertial-data'></a>
# Transmitting Inertial Data

<p align='center'>
<img src="https://github.com/robotology/yarp.js/blob/master/images/example_browser_inertial_data.png" width="60%">
</p>

This demo shows how information can be sent over the YARP network and visualized on the browser using different tools. In particular we will use [Google Charts](https://developers.google.com/chart/) and [Three.js](https://github.com/mrdoob/three.js/) (a wrapper for [WebGL](https://en.wikipedia.org/wiki/WebGL?oldformat=true)) to visualize the current orientation of a device streaming data over YARP.

**You will need two devices**: one equipped with inertial sensing capabilities, which will send the 3 dimensional vector containing the device orientation over the YARP network. A second device will act as a receiver, reading this information from the network and visualizing it on screen.

Follow the setup instructions [here](examples) to run the yarp.js server. Then, on both devices, go to the example page on the browser and click on the `inertial data` tab. On the device sending data, click on the `Send Data` button: you should start seeing something like this as you move the device around:

<p align='center'>
<img src="https://github.com/robotology/yarp.js/blob/master/images/visualize-data.gif" width="60%">
</p>

