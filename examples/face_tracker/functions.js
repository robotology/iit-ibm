function initializeButton(btnName,btn_port_name,is_receiving) {

  if(is_receiving === undefined)
    is_receiving = true;

  let btn = document.getElementById('btn-'+btnName);
  let input = document.getElementById('input-'+btnName);
  let form = document.getElementById('form-'+btnName);

  let connected = false;
  let initialized = false;

  function toggleConnection() {
    let other_port_name = input.value;

    if(!connected)
    {
      input.setAttribute('disabled','true');
      btn.classList.remove('btn-primary');
      btn.innerHTML='Disconnect';

      if(is_receiving)
        yarp.Network.connect(other_port_name,btn_port_name);
      else
        yarp.Network.connect(btn_port_name,other_port_name);

      connected = true;
      initialized = true;
    }
    else
    {
      if(is_receiving)
        yarp.Network.disconnect(other_port_name,btn_port_name);
      else
        yarp.Network.disconnect(btn_port_name,other_port_name);

      input.removeAttribute('disabled');
      btn.classList.add('btn-primary');
      btn.innerHTML='Connect';

      connected = false;
    }

  }

  btn.onclick = toggleConnection;
  form.addEventListener("submit", function(event){
      event.preventDefault();
      toggleConnection();
  });
}
