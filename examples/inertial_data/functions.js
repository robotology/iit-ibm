//  <!-- Google Charts -->

function drawLineColors() {

  chart.draw(data_view, options);

}


function _initData()
{
  data = new google.visualization.DataTable();
  data.addColumn('number', 'X');
  data.addColumn('number', 'Alpha');
  data.addColumn('number', 'Beta');
  data.addColumn('number', 'Gamma');

  data.addRow([ ,1,2,3]);

  data_view = new google.visualization.DataView(data);
  chart = new google.visualization.LineChart(document.getElementById('chart_div'));

  drawLineColors();
}


function _chartData() {

  if(datum != undefined && data != undefined)
  {
    datum.unshift(curr_idx);
    curr_idx++;

    data.addRow(datum);
    if(data.getNumberOfRows()>max_length)
      data_view.setRows(data.getNumberOfRows()-max_length,data.getNumberOfRows()-1);

    drawLineColors();
  }

  datum = undefined;

  setTimeout(_chartData,30);
}

function chartData(orientation) {
  if(datum == undefined)
   datum = orientation.splice(0);
}


// <!-- Three.js -->

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, 1, 1, 2000 );
    camera.applyMatrix( new THREE.Matrix4().makeTranslation( 0,0,200 ) );
    // camera.applyMatrix( new THREE.Matrix4().makeRotationX( 0 ) );
    // camera.position.y = 400;

    camera.lookAt( scene.position );

    scene.add( new THREE.AmbientLight( 0x404040 ) );

      var light = new THREE.DirectionalLight( 0xffffff );
      light.position.set( 0, 1, 0 );
      scene.add( light );


      var pointLight =
        new THREE.PointLight(0xFFFFFF);

      // set its position
      pointLight.position.x = 10;
      pointLight.position.y = 50;
      pointLight.position.z = 130;

      // add to the scene
      scene.add(pointLight);


      var textureLoader = new THREE.TextureLoader();



      var cellmaterial = new THREE.MeshLambertMaterial( {color: 0x274EC0 } );
      var smartface = new THREE.MeshLambertMaterial({ color:0xffffff, map: textureLoader.load( 'images/smartface.png' ) });

      var bkgMaterial = new THREE.MeshLambertMaterial( {color: 0xD4D6D8} );
      var bkgGeometry = new THREE.BoxGeometry( 1000, 1000, 5 , 1 , 1 , 1);
      var bkg = new THREE.Mesh(bkgGeometry, bkgMaterial );
      bkg.position.z = -300;
      scene.add(bkg);


    var geometry = new THREE.BoxGeometry( 45, 100, 5 , 1 , 1 , 1);

    materials = [cellmaterial,smartface];
    material = new THREE.MeshFaceMaterial(materials);

    for(var i = 0; i < geometry.faces.length; i++)
      geometry.faces[i].materialIndex = 0;

    geometry.faces[8].materialIndex = 1;
    geometry.faces[9].materialIndex = 1;

    // cellphone = new THREE.Mesh(geometry, material );
    // cellphone = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial() );
    cellphone = new THREE.Mesh(geometry, material );

    cellphone.rotation.reorder('YXZ');

    // geometry.faces[ 4 ].color.setHex( 0xff0000 );
    // geometry.faces[ 5 ].color.setHex( 0xff0000 );
    // cellphone.position.set( -200, 0, 0 );
    scene.add( cellphone );


    var renderer_options = {};
    renderer_options.canvas = document.getElementById("megacanvas");
    renderer_options.antialias = true;

    renderer = new THREE.WebGLRenderer(renderer_options);

    var w_gain = 0.35;
    var w_size = Math.floor(w_gain*window.innerWidth);
    renderer.setSize(w_size,w_size);
    renderer.setPixelRatio( window.devicePixelRatio );

}


function animate() {

  requestAnimationFrame( animate );

  render();

}


function render() {
  renderer.render( scene, camera );
}

function drawData(orientation) {



  // 'ZXY' for the device, but 'YXZ' for us
  euler.set(deg2rad(orientation[1]), deg2rad(orientation[0]), - deg2rad(orientation[2]), 'YXZ');

  quaternion.setFromEuler(euler);
  quaternionLerp.slerp(quaternion, 0.5); // interpolate


  if (autoAlign) orientationQuaternion.copy(quaternion); // interpolation breaks the auto alignment
  else orientationQuaternion.copy(quaternionLerp);

  // camera looks out the back of the device, not the top
  orientationQuaternion.multiply(q1);

  // adjust for screen orientation
  orientationQuaternion.multiply(q0.setFromAxisAngle(zee, 0));

  cellphone.quaternion.copy(alignQuaternion);
  cellphone.quaternion.multiply(orientationQuaternion);

}


function deg2rad(val) {
    return val * Math.PI / 180;
}
