
var songs = [
    {
		id: "s1234",
        artist:"Last Shadow Puppets",
        title:"My Mistakes Were Made For You",
        isnew: 1,
        duration:180,
        bpm:60,
        path: "http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1244",
        artist:"Audio Lotion",
        title:"Bandulu Jazz.fms",
        isnew: 1,
        duration:200,
        bpm:60,
        path: "http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s2234",
        artist:"Jacuzzi Jazz",
        title:"Jacuzzi Jazz.fms",
        isnew: 1,
        duration:190,
        bpm:60,
        path: "http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1334",
        artist:"Vanilla Shake",
        title:"Vanilla Shake.fms",
        isnew: 1,
        duration:210,
        bpm:60,
        path: "http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1235",
        artist:"Http WAV Test",
        title:"file_example_WAV_5MG.wav",
        isnew: 1,
        duration:200,
        bpm:60,
        path:"http://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_5MG.wav",
        actions:""
    },
    {
		id: "s1237",
        artist:"Http MP3 Test",
        title:"play.mp3",
        isnew: 1,
        duration:220,
        bpm:60,
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1235",
        artist:"Http WAV Test",
        title:"file_example_WAV_5MG.wav",
        isnew: 1,
        duration:230,
        bpm:60,
        path:"http://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_5MG.wav",
        actions:""
    },
    {
		id: "s1237",
        artist:"Http MP3 Test 2",
        title:"play.mp3",
        isnew: 1,
        duration:240,
        bpm:60,
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1235",
        artist:"New Test",
        title:"file_example_WAV_5MG.wav",
        isnew: 1,
        duration:270,
        bpm:60,
        path:"http://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_5MG.wav",
        actions:""
    },
    {
		id: "s1237",
        artist:"Test 23",
        title:"play.mp3",
        isnew: 1,
        duration:260,
        bpm:60,
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1235",
        artist:"Test 35",
        title:"file_example_WAV_5MG.wav",
        isnew: 1,
        duration:250,
        bpm:60,
        path:"http://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_5MG.wav",
        actions:""
    },
    {
		id: "s1237",
        artist:"Test 34",
        title:"play.mp3",
        isnew: 1,
        duration:280,
        bpm:60,
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    },
    {
		id: "s1235",
        artist:"Some Artist",
		title:"file_example_WAV_5MG",
        isnew: 1,
        duration:290,
        bpm:60,        
        path:"http://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_5MG.wav",
        actions:""
    },
    {
		id: "s1237",
        artist:"SmartPlay",
        title:"Play Song",
        isnew: 1,
        duration:300,
        bpm:60,        
        path:"http://api.audiotool.com/track/volution/play.mp3",
        actions:""
    }
];

var options = {
    data: songs,
    ordering: true,
    fixedheader: true,
    scrollable: true,
    //bodyheight: 200,
    fitHeight: true,
    sortable: true,
    columns: [
        { title: "ID", datafield: "id", visible: false, width: "10%" },        
        { title: "Title", datafield: "title", width: "100px", datafields: [{key: "data-translate", value: "{{lang.main.title}}"}] },
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

function ClickActionBtn(data)
{
    console.log("Action Data: "+data);
}