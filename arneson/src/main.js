// ---------------------------
// Global constants
// ---------------------------

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
// Logic wrapping classes
// ---------------------------

class ItemPromptModal {
  constructor(id, dataset) {
    this.element = document.querySelectorAll("#" + id)[0];
    // assume text has id = modal-id-text
    this.text = this.element.querySelectorAll("#" + id + "-text")[0];
    // assume save-button has id = modal-id-save
    this.save = this.element.querySelectorAll("#" + id + "-save")[0];
    // assume save-button has id = modal-id-del
    this.del = this.element.querySelectorAll("#" + id + "-del")[0];
    this.item = null;
    this.delete = false
    this.dataset = dataset;
    this.modal = M.Modal.init(this.element, {});
    this.save.addEventListener("click", () => {
      this.updateItem();
    });
    if(this.del !== null && this.del !== undefined){
      this.del.addEventListener("click", () => {
        this.dataset.remove(this.item.id);
      });  
    }
    this.text.onkeypress = (event) => {
      const keyCode = event.keyCode;
      if (keyCode === 13) {
        this.updateItem();
        this.modal.close();
      }
    };
  }
  updateItem() {
    if (this.item !== null) {
      this.item.content = this.text.value;
      if ("start" in this.item) {
        this.item.start = Date.parse(this.item.start.toString());
      }
      if ("end" in this.item) {
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

class TimelineWrapper {
  static lookupColor(index){
    const lookupArray = [
      "pink",
      "purple",
      "deep-purple",
      "indigo",
      "blue",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "grey",
      "blue-grey",
    ];
    return lookupArray[index]
  }

  static addClassNamesToGroups(groups){
    groups.forEach(g=>{
      g.className = TimelineWrapper.lookupColor(g.id-1);
    })
  }
  constructor() {
    this.groups = new vis.DataSet();
    this.items = new vis.DataSet();
    this.itemModal = new ItemPromptModal("item-prompt-modal", this.items);
    this.groupModal = new ItemPromptModal("group-prompt-modal", this.groups);
    let container = document.getElementById("visualization");
    this.options = {
      editable: true, // default for all items
      zoomable: false,
      horizontalScroll: true,
      format: {
        minorLabels: {
          millisecond:'SSS',
          second:     's',
          minute:     'HH:mm',
          hour:       'HH:mm',
          weekday:    '[Day] D',
          day:        '[Day] D',
          week:       'w',
          month:      '[Month] M',
          year:       '[Year] YY'
        },
        majorLabels: {
          millisecond:'HH:mm:ss',
          second:     'D MMMM HH:mm',
          minute:     'ddd D MMMM',
          hour:       'ddd D MMMM',
          weekday:    '[Month] M [Year] YY',
          day:        '[Month] M [Year] YY',
          week:       '[Month] M [Year] YY',
          month:      '[Year] YY',
          year:       ''
        }
      },
      template: function (item, element, data) {
        element.classList.add(TimelineWrapper.lookupColor(item.group-1));
        element.classList.add("white-text");
        element.classList.add("lighten-2");
        return item.content;
      },
    };
    this.timeline = new vis.Timeline(
      container,
      this.items,
      this.groups,
      this.options
    );
    this.timeline.on("doubleClick", (e) => {
      switch (e.what) {
        case "item":
          if (e.item !== null) {
            let item = this.items.get(e.item);
            this.itemModal.editItem(item);
          }
          break;
        case "group-label":
          if (e.group !== null) {
            let group = this.groups.get(e.group);
            this.groupModal.editItem(group);
          }
        default:
      }
    });
  }
  clear(){
    this.groups.clear();
    this.items.clear();
  }
  loadData(data) {
    this.items.clear();
    this.items.add(data.items);
    this.groups.clear();
    this.groups.add(data.groups);
  }
  saveData() {
    let itemdata = this.items.get({
      fields: ["id", "start", "content", "group"], // output the specified fields only
      type: {
        start: "Date", // convert the date fields to Date objects
        content: "String",
        group: "int", // convert the group fields to Strings
      },
    });
    let groupdata = this.groups.get({
      fields: ["id", "content"], // output the specified fields only
      type: {
        id: "int", // convert the date fields to Date objects
        content: "String", // convert the group fields to Strings
      },
    });
    return { groups: groupdata, items: itemdata };
  }
  addGroup() {
    let newid = 1;
    if (this.groups.length > 0){
      newid = this.groups.max("id").id + 1;
    }
    this.groups.add({ id: newid, content: "person_" + newid });
  }
}

// ---------------------------
// Declares
// ---------------------------
const timelineWrapper = new TimelineWrapper();

// ---------------------------
// Listeners
// ---------------------------
document.getElementById("footer-btn-save").addEventListener("click", () => {
  let data = timelineWrapper.saveData();
  localStorage.setItem("itemdata", JSON.stringify(data.items));
  localStorage.setItem("groupdata", JSON.stringify(data.groups));
  M.toast({html: 'Data saved!'})
});

document.getElementById("footer-btn-load").addEventListener("click", () => {
  let itemdata = JSON.parse(localStorage.getItem("itemdata")).filter(d=>d.id!==null && d.start!==null);
  let groupdata = JSON.parse(localStorage.getItem("groupdata")).filter(d=>d.id!==null && d.start!==null);
  timelineWrapper.loadData({ groups: groupdata, items: itemdata });
  M.toast({html: 'Loading data!'});
  timelineWrapper.timeline.setWindow("2001-01-01", "2001-02-01");
});
document.getElementById("edit-btn-char").addEventListener("click", () => {
  timelineWrapper.addGroup();
  M.toast({html: 'New character added!'})
});
document.getElementById("edit-btn-zoom").addEventListener("click", () => {
  timelineWrapper.timeline.setWindow("2001-01-01", "2001-02-01");
  M.toast({html: 'Zooming!'});
});
document.getElementById("edit-btn-clear").addEventListener("click", () => {
  timelineWrapper.clear();
  M.toast({html: 'Clearing all items!'});
});
