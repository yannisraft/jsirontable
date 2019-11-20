# JSIronTable
JS IronTable - A responsive Jquery Table for multiple purposes

This table provides a responsive JQuery table which includes:
- Column Sorting
- Fixed header
- Dynamic data
- Custom column view
- Column Rearrange

An example of use is described on the example.js file

```javascript

var options = {
    data: songs,
    ordering: true,
    fixedheader: true,
    scrollable: true,
    fitHeight: true,
    sortable: true,
    columns: [
        { title: "ID", datafield: "id", visible: false, width: "10%" },        
        { title: "Title", datafield: "title", width: "100px",datafields: [{key: "data-translate", value: "{{lang.main.title}}"}] },
        { title: "Is New", datafield: "isnew", width: "50%" },
        { title: "Duration", datafield: "duration" },
        { title: "Artist", datafield: "artist" },
        { title: "Bpm", datafield: "bpm" },        
        { title: "Path", datafield: "path", visible: false },
        { 
            title: "Actions", 
            datafield: "actions", 
            view: function ( data ) { 
                return '<a href="javascript:ClickActionBtn(\''+data.id+'\');" class="action_icon action_icon_edit"><i class="material-icons">edit</i></a>' 
            }
        },
    ],
    OnInitialized: function()
    {
        console.log("Initialized");
    },
    OnError: function(error)
    {
        console.log(error);
    }
};
$('.jsirontable').JSIronTable(options);

```

More updates and fixes coming soon..
