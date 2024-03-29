const container = document.querySelector('.container');
const addBlockBtn = document.querySelector('#add-block-btn');

function uniqueId() {
  let letters = 'abcdefghijklmnopqrstuvwxyz';
  let output = '';

  for (let i = 0; i < 5; i++) {
    let randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    output += randomLetter;
  }

  for (let i = 0; i < 5; i++) {
    let randomNumber = Math.floor(Math.random() * 10);
    output += randomNumber;
  }
  console.log(output)
  return output;
}

let borderPixel = '2px solid';
let blockCount = uniqueId();

function createBlock() {
  const block = document.createElement('div');
  block.classList.add('block');
  block.setAttribute('draggable', 'true');
  block.setAttribute('id', `block-${blockCount}`);
  block.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    removeBlock(block.id);
  });
  dragElement(block);
  addBorder(block);

  const title = document.createElement('h2');
  title.classList.add('block-title');
  if (document.getElementById('block-input').value != ''){
    title.textContent = document.getElementById('block-input').value;
  }
  else{
    title.textContent = 'Title';
  }
  title.addEventListener('click', () => {
    const newTitle = prompt('Wprowadź nowy tytuł');
    if (newTitle) {
      title.textContent = newTitle;
    }
  });

  const text = document.createElement('p');
  text.classList.add('block-text');
  text.textContent = 'Tekst w bloku';
  text.addEventListener('click', () => {
    const newText = prompt('Wprowadź nowy tekst');
    if (newText) {
      text.textContent = newText;
    }
  });

  block.appendChild(title);
  block.appendChild(text);

  container.appendChild(block);

  blockCount=uniqueId();
}

addBlockBtn.addEventListener('click', createBlock);

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function exportBlocks() {
  const blocks = document.querySelectorAll('.block');
  const blocksData = [];
  const settings = {
    glowing: borderPixel,
  }
  blocks.forEach(block => {
    const blockData = {
      id: block.id,
      title: block.querySelector('.block-title').textContent,
      text: block.querySelector('.block-text').textContent,
      x: block.offsetLeft,
      y: block.offsetTop
    };
    blocksData.push(blockData);
  });
  const data = { blocks: blocksData, settings: settings };
  const jsonData = JSON.stringify(data);
  const jsonDataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData);

  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', jsonDataUri);
  downloadLink.setAttribute('download', 'blocks.json');
  downloadLink.click();
}

const exportBtn = document.querySelector('#export-btn');
exportBtn.addEventListener('click', exportBlocks);
const importBtn = document.querySelector('#import-btn');

importBtn.addEventListener('click', () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const content = readerEvent.target.result;
      const blocksData = JSON.parse(content).blocks;
      const settingsData = JSON.parse(content).settings;
      borderPixel = settingsData.glowing; // glowing settings
      ClearBlocks();
      //saved blocks
      blocksData.forEach((blockData) => { 
        const block = document.createElement('div');
        block.classList.add('block');
        block.setAttribute('draggable', 'true');
        block.setAttribute('id', blockData.id);
        block.style.left = blockData.x + 'px';
        block.style.top = blockData.y + 'px';
        dragElement(block);
        addBorder(block);

        const title = document.createElement('h2');
        title.classList.add('block-title');
        title.textContent = blockData.title;
        title.addEventListener('click', () => {
          const newTitle = prompt('Wprowadź nowy tytuł');
          if (newTitle) {
            title.textContent = newTitle;
          }
        });

        const text = document.createElement('p');
        text.classList.add('block-text');
        text.textContent = blockData.text;
        text.addEventListener('click', () => {
          const newText = prompt('Wprowadź nowy tekst');
          if (newText) {
            text.textContent = newText;
          }
        });
        block.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            removeBlock(block.id);
          });

        block.appendChild(title);
        block.appendChild(text);

        container.appendChild(block);
        blockCount=uniqueId();
      });
    };
    reader.readAsText(file);
  });
  fileInput.click();
});

function removeBlock(id) {
    const block = document.getElementById(id);
    if (block) {
      block.parentNode.removeChild(block);
    }
  }

function ClearBlocks(){
  blockCount = uniqueId();
  const blocks = document.querySelectorAll('.block');
  blocks.forEach((block) =>{
    removeBlock(block.id);
})};
function changeBlockColor(id, bgColor, titleColor) {
  const block = document.getElementById(id);
  if (block) {
    block.style.backgroundColor = bgColor;
    block.querySelector('.block-title').style.color = titleColor;
  }
}

function addBorder(block) {
  let hue = 0;
  const intervalId = setInterval(() => {
    block.style.border=borderPixel;
    block.style.borderColor = `hsl(${hue}, 70%, 50%)`;
    hue = (hue + 1) % 360;
  }, 32);
}

function glow(){
  if (borderPixel != '2px solid'){
    borderPixel = '2px solid';
  }
  else{
    borderPixel = '0px';
  }
}
const glowBtn = document.querySelector('#glow-btn');
glowBtn.addEventListener('click', glow);
//const editBtn = document.querySelector('#edit-btn');
//editBtn.addEventListener('click', );

//bg
