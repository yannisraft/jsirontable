
var songs = [
    {
		id: "s1234_30",
        artist:"Last Shadow Puppets",
        title:"My Mistakes Were Made For You",
        isnew: 1,
        duration:180,
        bpm:15,   
        test: "40",
        path: "http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1244_31",
        artist:"Audio Lotion",
        title:"Bandulu Jazz.fms",
        isnew: 1,
        duration:200,
        bpm:165,   
        test: "10",
        path: "http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s2234_32",
        artist:"Jacuzzi Jazz",
        title:"Jacuzzi Jazz.fms",
        isnew: 1,
        duration:190,
        bpm:160,   
        test: "300",
        path: "http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1334_33",
        artist:"Vanilla Shake",
        title:"Vanilla Shake.fms",
        isnew: 1,
        duration:210,
        bpm:145,   
        test: "100",
        path: "http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1235_35",
        artist:"Http WAV Test",
        title:"file_example_WAV_5MG.wav",
        isnew: 1,
        duration:200,
        bpm:123,   
        test: "50",
        path:"http://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_5MG.wav",
        actions:""
    },
    {
		id: "s1237_36",
        artist:"Http MP3 Test",
        title:"play.mp3",
        isnew: 1,
        duration:220,
        bpm:95,   
        test: "60",
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1235_37",
        artist:"Http WAV Test",
        title:"file_example_WAV_5MG.wav",
        isnew: 1,
        duration:230,
        bpm:90,   
        test: "11",
        path:"http://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_5MG.wav",
        actions:""
    },
    {
		id: "s1237_38",
        artist:"Http MP3 Test 2",
        title:"play.mp3",
        isnew: 1,
        duration:240,
        bpm:70,   
        test: "120",
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1235_40",
        artist:"New Test",
        title:"file_example_WAV_5MG.wav",
        isnew: 1,
        duration:270,
        bpm:80,   
        test: "40",
        path:"http://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_5MG.wav",
        actions:""
    },
    {
		id: "s1237_41",
        artist:"Test 23",
        title:"play.mp3",
        isnew: 1,
        duration:260,
        bpm:35,   
        test: "30",
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1235_42",
        artist:"Test 35",
        title:"file_example_WAV_5MG.wav",
        isnew: 1,
        duration:250,
        bpm:111,   
        test: "90",
        path:"http://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_5MG.wav",
        actions:""
    },
    {
		id: "s1237_44",
        artist:"Test 34",
        title:"play.mp3",
        isnew: 1,
        duration:280,
        bpm:110,   
        test: "111",
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1235_43",
        artist:"Some Artist",
		title:"file_example_WAV_5MG",
        isnew: 1,
        duration:290,
        bpm:100,    
        test: "30",       
        path:"http://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_5MG.wav",
        actions:""
    },
    {
		id: "s1237_45",
        artist:"SmartPlay",
        title:"Play Song",
        isnew: 1,
        duration:300,
        bpm:65,   
        test: "30",     
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    }
];

for(var p=0; p < 200; p++)
{
    var s = {
        id: "sss_"+p,
        artist:"Artist "+p,
        title:"Song "+p,
        isnew: 1,
        duration:300,
        bpm: Math.floor(Math.random() * 100) + 20,        
        test: parseInt((Math.floor(Math.random() * 100) + 20).toString()),        
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    };
    songs.push(s);
}

var options = {
    data: songs,
    ordering: true,
    fixedheader: true,
    scrollable: true,
    nodatatext: "No Entries here",
    nodata_datafields: [{key: "data-translate", value: "{{lang.main.title}}"}],
    fitHeight: true,
    sortable: true,
    columns: [
        { title: "ID", datafield: "id", visible: true, width: "10%" },        
        { title: "Title", datafield: "title", width: "100px", datafields: [{key: "data-translate", value: "{{lang.main.title}}"}] },
        { title: "Is New", datafield: "isnew", width: "50%" },
        { title: "Duration", datafield: "duration" },
        { title: "Artist", datafield: "artist" },
        { title: "Bpm", datafield: "bpm" },        
        { title: "Test", datafield: "test" },        
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

console.log("Reloaded");

var irontable = $('.jsirontable').JSIronTable(options);
irontable.OnInitialized(function()
{
    console.log("Initialized");
});

irontable.OnError(function(error)
{
    console.log(error);
});

irontable.OnReload(function()
{
    console.log("Reload");
});



irontable.OnSort(function()
{
    console.log("Table Sorted");
});

irontable.BeforeSort(function()
{
    console.log("Before Table Sorted");
});

//console.log(irontable.GetRows());



var SECOND_irontable = $('.second_jsirontable').JSIronTable(options);
SECOND_irontable.OnInitialized(function()
{
    console.log("Initialized");
});


setTimeout(function()
{
    SECOND_irontable.options.data = [];
    SECOND_irontable.Reload();
}, 3000);


console.log($('.jsirontable').JSIronTable());

function ClickActionBtn(data)
{
    console.log("Action Data: "+data); 
    
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