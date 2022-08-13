// ---------------------------
// Utility Methods
// ---------------------------
function createElement(tag, classes = [], id = null) {
  const element = document.createElement(tag); 
  classes.forEach(c=>{element.classList.add(c);});
  if (id !== null){
    element.setAttribute("id", id);
  }
  return element;
}
// ---------------------------
// Tooling
// ---------------------------
class ItemPromptModal {
  constructor(id){
    this.element = document.querySelectorAll('#'+id)[0];
    this.text = this.element.querySelectorAll('#'+id+'-text')[0];
    this.save = this.element.querySelectorAll('#'+id+'-save')[0];
    this.item = null;
    this.save.addEventListener("click", ()=>{
      this.updateItem();
    })
  }
  updateItem(){
    if (this.item !== null){
      this.item.content = this.text.value;
      this.item.start = Date.parse(this.item.start.toString());
      items.updateOnly(this.item);
      this.item = null;
    }
  }
  editItem(item){
    this.item = item;
    this.text.value = item.content;
    let modal = M.Modal.init(this.element, {});
    modal.open();
    this.text.focus();
    this.text.select();
  }
}
const modal = new ItemPromptModal("item-prompt-modal");

// todo:replace
data = {
    "characters" : [
        {
            "id" : 1,
            "name" : "Goldilocks"
        },
        {
            "id" : 2,
            "name" : "Mama Bear"
        },        
    ]
}

// create groups to highlight groupUpdate
var groups = new vis.DataSet(data.characters.map(c=>{
    return {"id": c.id, "content":c.name};}));
  // create a DataSet with items
  var items = new vis.DataSet([
    { id: 1, content: "Editable", editable: true, start: "2010-08-19", group: 1 },
    {
      id: 2,
      content: "Editable",
      start: "2010-08-23T23:00:00",
      className: "red lighten-3",
      group: 2,
    },
    {
      id: 5,
      content: "Edit Time Only",
      start: "2010-08-28",
      group: 1,
    },
    {
      id: 6,
      content: "Edit Group Only",
      start: "2010-08-29",
      group: 2,
    },
    {
      id: 7,
      content: "Remove Only",
      start: "2010-08-31",
      group: 1,
    },
    { id: 8, content: "Default", start: "2010-09-19", group: 2 },
  ]);
  var container = document.getElementById("visualization");
  var options = {
    editable: true, // default for all items
  };
  var timeline = new vis.Timeline(container, items, groups, options);
  
  document.getElementById("createEventButton").addEventListener("click", ()=>{
    document.getElementById("happening-card").classList.toggle("hide")
  })

  document.getElementById("saveStateButton").addEventListener("click", ()=>{
    var poopers = items.get({
        fields: ['id', 'start', 'group'],    // output the specified fields only
        type: {
          start: 'Date',                   // convert the date fields to Date objects
          group: 'String'                 // convert the group fields to Strings
        }
      });
      data = {
          "characters": []
      }
    console.log(poopers)
  })

timeline.on("doubleClick", e=>{
  if (e.item !== null){
      item = items.get(e.item);
      modal.editItem(item);
  }
}
);

