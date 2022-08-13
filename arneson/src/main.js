
// todo:replace
data = {
  characters: [
    {
      id: 1,
      content: "Goldiflocks",
    },
    {
      id: 2,
      content: "Mama Bear",
    },
  ],
};

// create groups to highlight groupUpdate
groups = new vis.DataSet(data.characters);
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

// ---------------------------
// Utility Methods
// ---------------------------
function createElement(tag, classes = [], id = null) {
  const element = document.createElement(tag);
  classes.forEach((c) => {
    element.classList.add(c);
  });
  if (id !== null) {
    element.setAttribute("id", id);
  }
  return element;
}
// ---------------------------
// Tooling
// ---------------------------
class ItemPromptModal {
  constructor(id, dataset) {
    this.element = document.querySelectorAll("#" + id)[0];
    this.text = this.element.querySelectorAll("#" + id + "-text")[0];
    this.save = this.element.querySelectorAll("#" + id + "-save")[0];
    this.item = null;
    this.dataset = dataset;
    this.modal = M.Modal.init(this.element, {});
    this.save.addEventListener("click", () => {
      this.updateItem();
    });
    this.text.onkeypress = (event) => {
      const keyCode = event.keyCode;
      if (keyCode === 13) {
        this.updateItem();
        this.modal.close();
      }
    }    
  }
  updateItem() {
    if (this.item !== null) {
      this.item.content = this.text.value;
      if ("start" in this.item){
        this.item.start = Date.parse(this.item.start.toString());
      }
      if ("end" in this.item){
        this.item.end = Date.parse(this.item.end.toString());
      }
      this.dataset.updateOnly(this.item);
      this.item = null;
    }
  }
  editItem(item) {
    this.item = item;
    this.text.value = item.content;
    this.modal.open();
    this.text.focus();
    this.text.select();
  }
}
const itemModal = new ItemPromptModal("item-prompt-modal", items);
const groupModal = new ItemPromptModal("group-prompt-modal", groups);

var container = document.getElementById("visualization");
var options = {
  editable: true, // default for all items
  template: function (item, element, data) {
  const lookup = 
    ["pink", // #f06292 
    "purple", // #ba68c8 
    "deep-purple", // #9575cd 
    "indigo", // #7986cb 
    "blue", // #64b5f6 
    "light-blue", // #4fc3f7 
    "cyan", // #4dd0e1 
    "teal", // #4db6ac 
    "green", // #81c784 
    "light-green", // #aed581 
    "lime", // #dce775 
    "yellow", // #fff176 
    "amber", // #ffd54f 
    "orange", // #ffb74d 
    "deep-orange", // #ff8a65 
    "brown", // #a1887f 
    "grey", // #e0e0e0 
    "blue-grey"] // #90a4ae 
    element.classList.add(lookup[item.group-1]);
    element.classList.add("white-text");
    element.classList.add("lighten-2");

    return item.content;
  },
};
var timeline = new vis.Timeline(container, items, groups, options);
timeline.on("doubleClick", (e) => {
  switch (e.what) {
    case "item":
      if (e.item !== null) {
        item = items.get(e.item);
        itemModal.editItem(item);
      }
      break;
    case "group-label":
      if (e.group !== null) {
        group = groups.get(e.group);
        groupModal.editItem(group);
      }      
    default: 
  }
});

document.getElementById("footer-btn-save").addEventListener("click", () => {
  let itemdata = items.get({
    fields: ["id", "start", "content", "group"], // output the specified fields only
    type: {
      start: "Date", // convert the date fields to Date objects
      content: "String",
      group: "int", // convert the group fields to Strings
    },
  });
  let groupdata = groups.get({
    fields: ["id", "content"], // output the specified fields only
    type: {
      id: "int", // convert the date fields to Date objects
      content: "String", // convert the group fields to Strings
    },
  });
  localStorage.setItem("itemdata", JSON.stringify(itemdata));
  localStorage.setItem("groupdata", JSON.stringify(groupdata));
});

document.getElementById("footer-btn-load").addEventListener("click", () => {
  let itemdata = JSON.parse(localStorage.getItem("itemdata"));
  items.clear();
  items.add(itemdata);
  let groupdata = JSON.parse(localStorage.getItem("groupdata"));
  groups.clear();
  groups.add(groupdata);
  setTimeout(()=> timeline.fit(5000), 1000)
});

document.getElementById("edit-btn-char").addEventListener("click", () => {
  let newid = groups.max("id").id+1;
  groups.add({"id": newid, "content": "person_"+newid});
});
