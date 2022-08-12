// ---------------------------
// Globals
// ---------------------------



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
    onAdd: function (item, callback) {
        var modalElement = document.querySelectorAll('#prompt-modal')[0];
        var instance = M.Modal.init(modalElement, {});
        document.getElementById("handlingCardSaveBtn").addEventListener("click", ()=>{
            item.content = document.getElementById("happening-text").value;
            callback(item);
        });
        instance.open();
      }  
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
    if (e.item!=null){
        item = items.get(e.item);
        const modalElement = document.querySelectorAll('#prompt-modal')[0];
        const modalInstance = M.Modal.init(modalElement, {});
        modalElement.
    }
  })

