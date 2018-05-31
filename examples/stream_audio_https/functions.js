function convertFloat32ToInt16(buffer) {
  l = buffer.length;
  buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l])*0x7FFF;
  }
  return buf.buffer;
}
function toggleVoiceBTN(el)
{
  if($(el).hasClass('btn-primary'))
  {
    recording=false;
    $(el).removeClass('btn-primary');
    $(el).find('i').removeClass('fa-microphone');
    $(el).find('i').addClass('fa-microphone-slash');
  }
  else
  {
    recording=true;
    $(el).addClass('btn-primary');
    $(el).find('i').removeClass('fa-microphone-slash');
    $(el).find('i').addClass('fa-microphone');
  }
}
