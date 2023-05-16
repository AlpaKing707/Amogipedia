const partInfo = {
  "testa" : {
    "name" : "Am",
    "offset" : -1.25,
    "offsetFlip" : 0,
    "img_path" : "img/corpus/testus.png"
  },
  "pancia" : {
    "name" : "Og",
    "offset" : -1,
    "offsetFlip" : -1,
    "img_path" : "img/corpus/pancius.png"
  },
  "gambe" : {
    "name" : "Us",
    "offset" : -3,
    "offsetFlip" : -3,
    "img_path" : "img/corpus/gambus.png"
  }
};

const nameToIdReference = {
  "Am" : "testa",
  "Og" : "pancia",
  "Us" : "gambe"
}

let items = []; // puntatori ai div

window.onload = () => {
  const itemTemplate = document.getElementsByTagName("template")[0].content.querySelector(".item");
  
  // Click sul pulsante 'Aggiungi'
  document.getElementById("add").addEventListener("click", function(){
    const firstItem = document.importNode(itemTemplate, true);
    const clone = firstItem.cloneNode(true);
    createItem(clone);
    //console.log(items);
  });

  openPopup();
}

function openPopup(){
  const popupTemplate = document.getElementsByTagName("template")[0].content.querySelector(".popup");
  const popup = document.importNode(popupTemplate, true);
  document.body.appendChild(popup);
}

function closePopup(){
  const popup = document.querySelector(".popup");
  popup.style.display = "none";
}

function createItem(it){
  items.push(it);
  document.getElementById("item_list_v").insertBefore(it, document.getElementById("add"));
}

function findItemIndex(it){
  return items.indexOf(it);
}

function reverseText(str){
  return str.split("").reverse().join("");
}

function swapItem(currItem, offset){
  let app;
  let targetPos = findItemIndex(currItem);
  if (targetPos+offset <= items.length && targetPos+offset >= 0){
    if (offset < 0){
      document.getElementById("item_list_v").insertBefore(items[targetPos], items[targetPos+offset]);
    } else {
      document.getElementById("item_list_v").insertBefore(items[targetPos+offset], items[targetPos]);
    }
    app = items[targetPos + offset];
    items[targetPos + offset] = currItem;
    items[targetPos] = app;
  }
}

function removeItem(currItem){
  let targetPos = findItemIndex(currItem);
  items.splice(targetPos, 1);
  //console.log(items);
  currItem.remove();
}

function flipItem(cbox){
  let item_div = cbox.parentElement.parentElement.parentElement;
  let imm = item_div.querySelector(".icon_v");
  let text = item_div.querySelector(".name");
  let isChecked = cbox.checked;
  if (isChecked) {
    imm.style.rotate = "180deg";
  } else {
    imm.style.rotate = "0deg";
  }
  text.innerHTML = reverseText(text.innerHTML);
}

function dropPart(ev){
  ev.preventDefault();
  ev.target.classList.remove("dropping");
  let partID = ev.dataTransfer.getData("text");
  let icon = ev.target; // icona del pezzo di amogus
  let text = ev.target.parentElement.querySelector(".name");  // span nome (accesso tramite nodo padre)
  icon.src = document.getElementById(partID).src;
  text.innerHTML = partInfo[partID]["name"];
}

function dragPart(ev){
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
  ev.target.classList.add("dropping");
}

function finishDrop(ev){
  ev.target.classList.remove("dropping");
}

function refreshPreview(){
  document.querySelector(".prev_container").querySelectorAll("img").forEach(
    function(imm){
      imm.remove();
    }
  );
  let nomogus = "";
  for (let i=0; i<items.length; i++){
    let name = items[i].querySelector('.name').innerHTML;
    let flipped = items[i].querySelector("#flip").checked;
    let newImg = document.createElement('img');
    let nameKey = name;
    if (flipped) {
      nameKey = reverseText(name);
      newImg.style.rotate = "180deg";
      newImg.style.zIndex = i;
      newImg.style.marginTop = partInfo[nameToIdReference[nameKey]]["offsetFlip"] + "vh";
      newImg.style.transform = "scaleX(-1)"
    } else {
      newImg.style.marginBottom = partInfo[nameToIdReference[nameKey]]["offset"] + "vh";
      newImg.style.zIndex = i*(-1);
    }
    newImg.className = "display_item";
    newImg.src = partInfo[nameToIdReference[nameKey]]["img_path"];
    nomogus += name;
    document.querySelector(".prev_container").appendChild(newImg);
  }
  document.getElementById("mogus_name").innerHTML = nomogus.toUpperCase();
}