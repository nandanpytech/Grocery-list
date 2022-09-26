const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");



let editElement;
let editFlag=false;
let editID="";
// submit form 
form.addEventListener("submit",addItem)
// clear items 
clearBtn.addEventListener("click",clearItems)

window.addEventListener("DOMContentLoaded", setupItems);


function addItem(e){
    e.preventDefault();
    const value=grocery.value;
    const id=new Date().getTime().toString();
    console.log(id)
    if(value && editFlag===false){
        const element=document.createElement("article");
        let attr=document.createAttribute("data-id");
        attr.value=id;
        element.setAttributeNode(attr);
        element.classList.add("grocery-item");
        element.innerHTML= `<p class="title">${value}</p>
        <div class="btn-container">
          <!-- edit btn -->
          <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <!-- delete btn -->
          <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      const deletBtn=element.querySelector(".delete-btn");
      deletBtn.addEventListener("click",deleteItem);
      const editBtn=element.querySelector(".edit-btn");
      editBtn.addEventListener("click",editItem);

      list.appendChild(element);
      displayAlert("Item added","success")
      container.classList.add("show-container");
    
    //add to localStorage
    addToLocalStorage(id,value);
    //set back to default
    setbackTodefault()

    }
    else if(value && editFlag===true){
      editElement.innerHTML=value;
      displayAlert("value changed","success")

      //edit local storage
      editLocalStorage(editID,value);
      setbackTodefault();
    }
    else{
        // alert.textContent="Empty value";
        // alert.classList.add("alert-danger");
        displayAlert("Please enter value","danger")
    }

    //display alert
    function displayAlert(text,action){
        alert.textContent=text;
        alert.classList.add(`alert-${action}`)

        setTimeout(function(){
            alert.textContent="";
            alert.classList.remove(`action-${action}`);
        },1000)
    }

   

    function setbackTodefault(){
        grocery.value="";
        editFlag=false;
        editID="";

    }
   
}
function clearItems(){
    const items=document.querySelectorAll(".grocery-items");
    console.log(items)
    if(items.length>0){
        items.forEach(function(item){
            list.removeChild(item);
        })
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
  
    list.removeChild(element);
  
    if (list.children.length === 0) {
      container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
  
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}
  
function editItem(e){
  const element=e.currentTarget.parentElement.parentElement
  console.log(element)
  editElement = e.currentTarget.parentElement.previousElementSibling;  //it is <p> element
  grocery.value=editElement.innerHTML;
  editFlag=true;
  editID=element.dataset.id;
  submitBtn.textContent="edit";
 
}

function addToLocalStorage(id,value){
  const grocery={id,value};
  console.log(grocery)
  let items=getLocalStorage();
  
  items.push(grocery)
  console.log(items)

  localStorage.setItem("list", JSON.stringify(items));
  
}

function getLocalStorage(){
  return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
//setup items from localStorage
function setupItems(){
  let items=getLocalStorage();
  if(items.length>0){
    items.forEach(function(item){
      createListItem(item.id,item.value);
    });
    container.classList.add("show-container")
  }
}
function createListItem(id,value){
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // append child
  list.appendChild(element);
}