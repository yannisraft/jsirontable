# JSIronTable
JS IronTable - A responsive Jquery Table for multiple purposes

This table provides a responsive JQuery table which includes:
- Column Sorting
- Fixed header
- Dynamic data
- Custom column view
- Column Rearrange
- 2D Support for auto rows and columns generation

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
    ]
};
$('.jsirontable').JSIronTable(options);

```

It also provides the following Event Listeners
- OnInitialized() - When the Table has finished loading
- OnError() - When an Error occurs
- OnReload() - When the table reloads
- OnSort() - Gets called after sorting has benn completed
- BeforeSort() - Gets called before sorting occurs

Example: 

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

var jsirontable = $('.jsirontable').JSIronTable(options);

```

or declaring them in a later state

```javascript

jsirontable.OnInitialized(function() {
});

jsirontable.OnError(function(error) {
});

jsirontable.OnReload(function() {
});

jsirontable.OnSort(function() {
});

jsirontable.BeforeSort(function() {
});

```

An 2D example to create columns and rows from the data itself with a unique BPM for each artist

```javascript

var {    
    data: songs,
    nodatatext: "No Entries here",
    nodata_datafields: [{key: "data-translate", value: "{{lang.main.title}}"}],
    scrollable: true,
    fitHeight: true,
    fixedheader: true,
    sortable: false,
    draggableColumns: false,
    headerfontsize: "8pt",
    cellfontsize: "8pt",
    rowPerUniqueValue: {
        datafield: "bpm", 
        sortCompare: function (a,b) { return b-a; } // numeric reverse sort
    },
    columns: [
        { 
            title: "BPM",
            datafield: "bpm",
            visible: true,
        },        
        { 
            fromUniqueValues: {
                datafield: "artist", 
                sortCompare: function(a,b) { return a.localeCompare(b);} // alpha sort
            },
            view: function ( data ) { 
                return  1;
            },
            combineValues: function ( dataList ) {
                return dataList.length
            }
        }
    ]
};
$('.jsirontable').JSIronTable(options);

```

More updates and fixes coming soon..
