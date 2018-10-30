var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
  // 通信成功时，状态值为4
  if (xhr.readyState === 4){
    if (xhr.status === 200){
      console.log(xhr.responseText);
      var zyzy = document.getElementById("zyzy");
      var arrayZyzy = xhr.responseText.split("\n\n");
      
      var index1 = Math.floor(Math.random()*arrayZyzy.length);
      var index2 = Math.floor(Math.random()*arrayZyzy.length);
      while(index2 == index1){
        index2 = Math.floor(Math.random()*arrayZyzy.length);
      }
      var index3 = Math.floor(Math.random()*arrayZyzy.length);
      while(index3 == index1 || index3 == index2){
        index3 = Math.floor(Math.random()*arrayZyzy.length);
      }

      var resText = "";
      resText += "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+ arrayZyzy[index1] + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
      resText += arrayZyzy[index2];
      zyzy.innerHTML = resText;
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.onerror = function (e) {
  console.error(xhr.statusText);
};

xhr.open('GET', '/zyzy.txt', true);
xhr.send(null);