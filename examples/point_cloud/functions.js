function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;
  scene.add( camera );

  scene.add( new THREE.AmbientLight( 0xf0f0f0 ) );
  var light = new THREE.SpotLight( 0xffffff, 1.5 );
  light.position.set( 0, 1500, 200 );
  light.castShadow = true;
  light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 70, 1, 200, 2000 ) );
  light.shadow.bias = -0.000222;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  scene.add( light );
  spotlight = light;

  // scene.add( new THREE.CameraHelper( light.shadow.camera ) );

  var planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
  planeGeometry.rotateX( - Math.PI / 2 );
  var planeMaterial = new THREE.ShadowMaterial();
  planeMaterial.opacity = 0.2;

  var plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.position.y = -200;
  plane.receiveShadow = true;
  scene.add( plane );

  var helper = new THREE.GridHelper( 1000, 100 );
  helper.position.y = - 199;
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  scene.add( helper );

  var axis = new THREE.AxesHelper();
  axis.position.set( -500, -500, -500 );
  scene.add( axis );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0xf0f0f0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  container.appendChild( renderer.domElement );

  var info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  // info.innerHTML = 'catmull-rom rom spline comparisions';
  options = document.createElement( 'div' );
  options.style.position = 'absolute';
  options.style.top = '30px';
  options.style.width = '100%';
  options.style.textAlign = 'center';

  // options.innerHTML = 'Points: <input type="button" onclick="addPoint();" value="+" />\
  //   <input type="button" onclick="removePoint();" value="-" />\
  //   <input type="button" onclick="exportSpline();" value="Export" /><br />\
  //   <input type="checkbox" id="uniform" checked /> <label for="uniform">Uniform Catmull-rom</label>  <input type="range" id="tension" onchange="splines.uniform.tension = tension.value;updateSplineOutline();" min=0 max=1 step=0.01 value=0.5 /> <span id="tension_value" /></span> <br />\
  //   <input type="checkbox" id="centripetal" checked /> Centripetal Catmull-rom<br />\
  //   <input type="checkbox" id="chordal" checked /> Chordal Catmull-rom<br />';

  container.appendChild( info );
  container.appendChild( options );

  // Controls
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  controls.keys = { LEFT: 65, UP: 87, RIGHT: 68, BOTTOM: 83 };
  controls.keyPanSpeed = 7.0;

  // controls = new THREE.FirstPersonControls( camera, renderer.domElement );
  // // controls = new THREE.MouseControls( camera );

  // // controls.damping = 0.2;
  // // controls.addEventListener( 'change', render );

  // controls.movementSpeed = 70;
  // controls.lookSpeed = 0.01;
  // controls.noFly = false;
  // controls.lookVertical = true;
  // controls.activeLook = false;

  // controls._update = controls.update;
  // controls.update = function(){controls_orbit.update();controls._update(0.1);};

  geometry = new THREE.BufferGeometry();


  var positions = new Float32Array( MAX_POINTS*3 ); // 3 vertices per point
  var colors = new Float32Array( MAX_POINTS*3 ); // 3 colors per point


  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );


  // draw range
  // drawCount = 10000; // draw the first 2 points, only
  geometry.setDrawRange( 0, counter_draw_points );

  materials = new THREE.PointsMaterial( {
    size:default_size,
    vertexColors: THREE.VertexColors
  } );

  particles = new THREE.Points( geometry, materials );

  particles.visible = false;

  scene.add( particles );

}

function animate() {

  requestAnimationFrame( animate );
  render();
  controls.update();

}

function render() {

  renderer.render( scene, camera );

}

function addPoint(content)
{

  // if it is only one vector of positions wrap it up in a single Array
  if(content[0].constructor != Array)
    content = [content];

  var make_particles_visible = false;
  if( !particles.visible )
  {
    counter_draw_points = 0;
    make_particles_visible = true;
  }

  for( var idx_i = 0; idx_i < content.length; idx_i++)
  {

      var tmp_positions = particles.geometry.attributes.position.array;
      var tmp_colors = particles.geometry.attributes.color.array;

      // add the new position
      tmp_positions[3*counter_draw_points] = content[idx_i][1];
      tmp_positions[3*counter_draw_points+1] = content[idx_i][2];
      tmp_positions[3*counter_draw_points+2] = content[idx_i][0];


      // set the color position
      var color;
      if( content[idx_i].length >=6 )
        color = content[idx_i].slice(3).map(function(i){if(i>1) i=i/255; return i;});
      else
        color = default_color;

      tmp_colors[3*counter_draw_points] = color[0];
      tmp_colors[3*counter_draw_points+1] = color[1];
      tmp_colors[3*counter_draw_points+2] = color[2];

      // set the size for all points
      if (content[idx_i].length >=7 )
        particles.material.size = content[idx_i][6];

      counter_draw_points++;

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.color.needsUpdate = true;

  }

  geometry.setDrawRange( 0, counter_draw_points );

  if(make_particles_visible)
    particles.visible = true;

}
