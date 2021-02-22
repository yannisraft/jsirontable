

// Using Example Data

var options = {    
    data: songs,
    nodatatext: "No Entries here",
    nodata_datafields: [{key: "data-translate", value: "{{lang.main.title}}"}],
    debug: true, // Done
    maxHeight: 300, // Done
    fixedheader: true,
    scrollable: true, // Done
    fitHeight: true,
    sortable: true, // Done
    draggableColumns: true,
    headerfontsize: "12pt", // Done
    cellfontsize: "12pt", // Done
    columns: [
        { title: "ID", datafield: "id", visible: true, width: "10%" },        
        { title: "Title", datafield: "title", width: "100px", datafields: [{key: "data-translate", value: "{{lang.main.title}}"}] },
        { title: "Is New", datafield: "isnew", width: "10%" },
        { title: "Duration", datafield: "duration" },
        { title: "Artist", datafield: "artist" },
        { title: "Bpm", datafield: "bpm" },        
        { title: "Test", datafield: "test" },        
        { title: "Path", datafield: "path", visible: false },
        { 
            title: "Actions", 
            datafield: "actions", 
            view: function ( data ) { 
                return '<a href="javascript:ClickActionBtn(\''+data.id+'\');" class="action_icon action_icon_edit"><i class="material-icons">delete_forever</i></a>' 
            }
        },
    ]
};

var irontable = $('#jsirontable').JSIronTable(options);
irontable.OnInitialized(function()
{
    
});

irontable.OnError(function(error)
{
    
});

irontable.OnReload(function()
{
    
});

irontable.OnSort(function()
{
    
});

irontable.BeforeSort(function()
{
    
});

//console.log(irontable.GetRows());


/*
var SECOND_irontable = $('.second_jsirontable').JSIronTable(options);
SECOND_irontable.OnInitialized(function()
{
    
});*/


setTimeout(function()
{
    /* SECOND_irontable.options.data = [];
    SECOND_irontable.Reload(); */
    //irontable.Reload();
    console.log("Reload");
}, 3000);


//console.log($('.jsirontable').JSIronTable());

function ClickActionBtn(data)
{    
    var row = irontable.GetRow(function(e)
    {    
        var found = null;
        if(e.data.id === data)
        {
            found = e;
        }
        return found;
    });

    $(row.element).css({"background-color": "yellow"});
    $(row.element).addClass("disabled");

    irontable.RemoveRow(row);
}

var options2d = {    
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

var irontable2 = $('#jsirontable2').JSIronTable(options2d);