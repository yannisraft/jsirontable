/*
* JSIronTable - Copyright 2019 Raftopoulos Yannis
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* */

;(function ($, window, document, undefined) {

    var pluginName = "JSIronTable",
        dataKey = "plugin_" + pluginName;

    var Plugin = function (element, options) {
    
        this.element = element;
        
        this.options = {
            data: [],
            fitHeight: false,
            ordering: true,
            fixedheader: true,
            scrollable: true,
            sortable: true,
            columns: [],
            rows: [],
            headercells: [],
            columnfields: [],
            OnInitialized: null
        };
        
        this.init(options);
    };

    Plugin.prototype = {
        init: function (options) {
            $.extend(this.options, options);
            
            var self = this;
            this.body = $('<div class="jsit_body"></div>');
            this.element.html(this.body);

            
            this.rows = [];
            this.cols = [];
            this.headercells = [];            
            this.columnfields = [];
            this.initialHeight = 0;

            // Create Elements
            try
            {
                if(this.Validate(options))
                {
                    this._generateheader = true;
                    if(this.Validate(options.header))
                    {
                        if(options.header == false)
                        {
                            this._generateheader = false;
                        }
                    }
                    
                    if(this._generateheader && this.Validate(options.columns))
                    {
                        this.heading = $('<div class="jsit_heading"></div>');
                        this.element.prepend(this.heading);
    
                        if(this.Validate(options.fixedheader))
                        {
                            if(options.fixedheader)
                            {
                                $(this.heading).addClass("jsit_fixedheader");
                            }
                        }
                    }
    
                    // Create Header
                    this.CreateHeader();
    
                    // Create Data
                    this.CreateData();
    
                    this.initialHeight = this.element.height();
    
                    self.FitSize();
                    $(window).resize(function() {                    
                        self.FitSize();
                    });
    
                    if(this.Validate(this.options.OnInitialized))
                    {
                        if(typeof this.options.OnInitialized === "function")
                        {
                            this.options.OnInitialized(true);
                        }
                    }
                } else {
                    Notify(this.body, "No options defined");
                }
            } catch(ex)
            {
                ThrowError(ex);
            }            
        },

        Validate: function(variable)
        {
            var result = false;
            if(variable !== null && typeof variable !== 'undefined')
            {
                result = true;
            }
            return result;
        },

        Reload: function()
        {
            $(this.body).html('');
            this.CreateData();
        },

        StartLoader: function()
        {
            $(this.body).html('<div class="jsit_loader_container"><div class="jsit_loader"></div></div>');
        },

        Clear: function()
        {
            $(this.body).html("");
            Notify(this.body, "No data available");
        },

        FitSize: function()
        {
            if(this.Validate(this.options.fitHeight))
            {
                if(this.options.fitHeight === true)
                {
                    var offset = this.element.offset();
                    var posY = offset.top - $(window).scrollTop();
                    var posX = offset.left - $(window).scrollLeft();

                    if($(window).height() < (this.initialHeight + posY+2*$(this.heading).height()))
                    {
                        var maxheight = $(window).height() - posY;                
                        $(this.body).css("max-height", ($(window).height() - posY - 2*$(this.heading).height()) );
                    } else {
                                    
                    }  
                    
                    if(HasScrollBar(this.body))
                    {
                        $(this.heading).css("padding-right", GetScrollBarWidth());
                    } else {
                        $(this.heading).css("padding-right", "0");
                    }
                }
            }            
        },

        CreateHeader: function()
        {
            // Create Header
            // ---
            var self = this;
            $(this.heading).html("");
            this.columnfields = [];
            
            if(this._generateheader && self.Validate(this.options.columns))
            {                        
                var row = $('<div class="jsit_row heading"></div>');
                $(this.heading).append(row);
                
                for(var j=0; j < this.options.columns.length; j++)
                {                
                    var col = this.options.columns[j];            
                    var column = {  
                        key: col.datafield                           
                    };

                    var hiddenclass = "";     
                    var isvisible = true;   
                    if(self.Validate(this.options.columns[j].visible))
                    {
                        if(this.options.columns[j].visible)
                        {
                            hiddenclass = "";
                            this.columnfields.push(this.options.columns[j].datafield);
                        } else {
                            isvisible = false;   
                            hiddenclass = " jsit_hiddencol";
                        }
                    } else {
                        this.columnfields.push(this.options.columns[j].datafield);
                    }

                    var addstyle = "";
                    if(self.Validate(this.options.columns[j].width))
                    {
                        var w = this.options.columns[j].width;
                        if(w.includes("px"))
                        {
                            addstyle = ' style="width: '+this.options.columns[j].width+'; flex: none;"';
                        } else if(w.includes("%"))  
                        {
                            addstyle = ' style="width: '+this.options.columns[j].width+'; flex: none;"';
                        }                                       
                    }

                    var sortableclass = "";
                    if(self.Validate(this.options.sortable))
                    {
                        if(this.options.sortable)
                        {
                            sortableclass = ' class="jsit_sortheader" id="jsit_sortheader_id'+j+'"';
                        }
                    }
                    
                    column.title = this.options.columns[j].title;                    
                    var cellvalue = this.options.columns[j].title;

                    var datefields_str = "";
                    if(self.Validate(this.options.columns[j].datafields))
                    {
                        var datafields = this.options.columns[j].datafields;
                        if(datafields.length > 0)
                        {
                            for(var f=0; f < datafields.length; f++)
                            {
                                datefields_str += ' ' + datafields[f].key + '="'+datafields[f].value+'" ';
                            }
                        }
                    }
                    
                    var span =  $('<span'+sortableclass+datefields_str+'>'+cellvalue+'</span><i class="material-icons jsit_ordericon">remove</i>');
                    // Add On click listener to the header
                    //
                    $(span).click(function(e) {
                        var targ = e.target.id;
                        var lastChar = targ.charAt(targ.length - 1);
                        e.preventDefault();
                        self.SortTableByColumn(lastChar, this.parentElement);
                    });
                    
                    // var cell = $('<div id="hd_'+column.key+'" class="jsit_head'+hiddenclass+' jsit_noselect"'+addstyle+'><span'+sortableclass+datefields_str+'>'+cellvalue+'</span><i class="material-icons jsit_ordericon">remove</i></div>');
                    var cell = $('<div id="hd_'+column.key+'" class="jsit_head'+hiddenclass+' jsit_noselect"'+addstyle+'></div>');
                    $(cell).html(span);
                    row.append(cell);

                    //self.addDragEvent(cell);
                    addDragEvent(cell, self);

                    var x = cell.position().left;
                    self.headercells.push({column: column, html: cell, sx: 0, w: 0, order: j, visible: isvisible});
                    
                    // Drag Cell Size
                    //
                    // /createDraggable(cell, this, j);
                    

                    this.cols.push(column);
                }

                for(var p=0; p < row.children().length; p++)
                {
                    var child = row.children()[p];
                    for(var s=0; s < self.headercells.length; s++)
                    {
                        var key = "hd_"+self.headercells[s].column.key;
                        if(key === $(child).attr("id"))
                        {
                            self.headercells[s].sx = $(child).position().left;
                            self.headercells[s].w = $(child).width();
                            break;
                        }
                    }
                }                
            }
        },        
        // ---
        // End Create Header

        CreateData: function()
        {
            // Create Data
            // ---
            var self = this;
            $(this.body).html("");
            if(self.Validate(this.options.data))
            {
                if(this.options.data.length > 0)
                {
                    for(var k=0; k < this.options.data.length; k++)
                    {
                        var rowclass = "odd";
                        if((k+1) % 2 == 0) rowclass = "even";

                        var row = $('<div class="jsit_row '+rowclass+'"></div>');
                        $(this.body).append(row);                    

                        for(var g=0; g < this.options.columns.length; g++)
                        {
                            var found_column_data = false;
                            var mainkey = this.options.columns[g].datafield;

                            var hiddenclass = " jsit_hiddencol";
                            if(this.columnfields.length > 0)
                            {                                
                                for(var p=0; p < this.columnfields.length; p++)
                                {                                
                                    if(mainkey === this.columnfields[p])
                                    {
                                        hiddenclass = "";
                                        break;
                                    }
                                }
                            }

                            var addstyle = "";
                            if(self.Validate(this.options.columns[g].width))
                            {
                                var w = this.options.columns[g].width;
                                if(w.includes("px"))
                                {
                                    addstyle = ' style="width: '+this.options.columns[g].width+'; flex: none;"';
                                } else if(w.includes("%"))  
                                {
                                    addstyle = ' style="width: '+this.options.columns[g].width+'; flex: none;"';
                                }                               
                            }

                            for (var key in this.options.data[k])
                            {
                                var cellvalue = this.options.data[k][key];                            
                                if(this.options.columns[g].datafield === key)
                                {
                                    found_column_data = true;
                                    if(self.Validate(this.options.columns[g].view))
                                    {
                                        cellvalue = this.options.columns[g].view(this.options.data[k]);                                
                                    }

                                    var cell = $('<div class="jsit_cell'+hiddenclass+'"'+addstyle+'><span>'+cellvalue+'</span></div>');
                                    row.append(cell);

                                    break;
                                }
                            }
                    
                            if(!found_column_data)
                            {
                                var cell = $('<div class="jsit_cell'+hiddenclass+'"'+addstyle+'><span>&nbsp;</span></div>');
                                row.append(cell);
                            }           
                        }
                    }

                    if(this._generateheader)
                    {
                        if(this.Validate(this.options.bodyheight))
                        {
                            $(this.body).css("max-height", this.options.bodyheight - $(this.heading).height() );
                        }

                        if(this.Validate(this.options.scrollable))
                        {
                            if(this.options.scrollable === true)
                            {
                                $(this.body).addClass("jsit_scrollbody");

                                if(HasScrollBar(this.body))
                                {
                                    $(this.heading).css("padding-right", GetScrollBarWidth());
                                }
                            }                            
                        }
                    }
                } else {
                    Notify(this.body, "No data available");
                }            
            } else {
                Notify(this.body, "No data available");
            }            
        },
        // ---
        // End Create Data

        SortTableByColumn(n, caller) {
            if(!$(caller).hasClass("dragging"))
            {
                var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        
                table = $(caller).parent().parent().parent();
                switching = true;
                dir = "asc";
        
                var all_icon_elements = table.children(".jsit_heading").children(".jsit_row")[0];
                for(var g=0; g < $(all_icon_elements).children(".jsit_head").length; g++)
                {
                    var head = $(all_icon_elements).children(".jsit_head")[g];
                    var head_icon_elemen = $(head).children(".jsit_ordericon")[0];
                    $(head_icon_elemen).html("remove");
                }
        
                var icon_element = $(caller).children(".jsit_ordericon")[0];
            
                while (switching) {
                  switching = false;
                  rows = $(table).find(".jsit_body").children(".jsit_row");
            
                  for (i = 0; i < (rows.length - 1); i++) {
                    shouldSwitch = false;
            
                    x = $(rows[i]).children(".jsit_cell")[n];
                    y = $(rows[i + 1]).children(".jsit_cell")[n];
            
                    x = $(x).children("span");
                    y = $(y).children("span");
            
                    if (dir == "asc") {
                        $(icon_element).html("keyboard_arrow_down");
                        if($.isNumeric(  ) )
                        {
                            if (Number($(x).html()) > Number($(y).html())) {
                                shouldSwitch = true;
                                break;
                            }
                        } else {
                            if($(x).html() != null && typeof $(x).html() != 'undefined')
                            {
                                if ($(x).html().toLowerCase() > $(y).html().toLowerCase()) {
                                    shouldSwitch = true;
                                    break;
                                }
                            }                    
                        }              
                    } else if (dir == "desc") {
                        $(icon_element).html("keyboard_arrow_up");
                        if($.isNumeric( $(x).html() ) )
                        {
                            if (Number($(x).html()) < Number($(y).html())) {
                                shouldSwitch = true;
                                break;
                            }
                        } else {
                            if($(x).html() != null && typeof $(x).html() != 'undefined')
                            {
                                if ($(x).html().toLowerCase() < $(y).html().toLowerCase()) {
                                    shouldSwitch = true;
                                    break;
                                }
                            }                    
                        }              
                    }
                  }
                  if (shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    switchcount ++; 
                  } else {
                    if (switchcount == 0 && dir == "asc") {
                      dir = "desc";
                      switching = true;
                    }
                  }
                }
        
                // Now remove all classes Odd or Even ad re add them
                for(var t=0; t < rows.length; t++)
                {
                    $(rows[t]).removeClass("odd");
                    $(rows[t]).removeClass("even");
        
                    var rowclass = "odd";
                    if((t+1) % 2 == 0) rowclass = "even";
                    $(rows[t]).addClass(rowclass);
                }
            }            
        },
        // ---
        // End SortTableByColumn
    };    

    var HasScrollBar = function(target)
    {
        return target.get(0).scrollHeight > target.height();
    };

    var Notify = function(target, text)
    {
        $(target).html('<div class="emptytable">'+text+'</div>');
    };

    var ThrowError = function(target, error)
    {
        if(this.Validate(target.options))
        {
            if(this.Validate(target.options.OnError))
            {
                if(typeof target.options.OnError === "function")
                {
                    this.options.OnError(error);
                }
            }
        }        
    };

    var addDragEvent = function(cell, table)
    {
        $( cell ).draggable(
        { 
            axis: "x",
            containment: "parent",
            start: function(ev,ui) {
                this.ax = $(ev.target).position().left;
            },
            drag: function(ev,ui) {
                $(ev.target).addClass("dragging");            
            },
            stop: function(ev,ui) {        
                setTimeout(function()
                {
                    $(ev.target).removeClass("dragging");
                }, 500);

                var a_x = -1;
                var a_index = -1;
                var b_x = -1;
                var b_index = -1;
                
                a_x = $(ev.target).position().left;
                
                var headercells = $(ev.target).parent().children(".jsit_head");
                for(var j=0; j < headercells.length; j++)
                {
                    var currentheader = headercells[j];
                    var currentheader_x = $(currentheader).position().left;
                    var currentheader_w = $(currentheader).outerWidth();
                    
                    if((a_x >= currentheader_x) && a_x < (currentheader_x + currentheader_w) && $(ev.target).attr("id") != $(currentheader).attr('id'))
                    {
                        // console.log("B LEFT: "+currentheader_x);
                        //console.log("A: "+$(ev.target).attr("id"));
                        //console.log("B: "+$(currentheader).attr('id'));

                        var resulttable = ExchangeColumns($(ev.target).attr("id"), $(currentheader).attr('id'), table); 
                        table = resulttable;
                        break;
                    }
                }

                $(this).css({left: 0});
            }
        });

        return table;
    };

    var ExchangeColumns = function(sourceColumnA, targetColumnB, table)
    {
        console.log("ExchangeColumns");
        var a_index = -1;
        var b_index = -1;
        for(var j=0; j < table.cols.length; j++)
        {
            if("hd_"+table.cols[j].key == sourceColumnA)
            {
                a_index = j;
            } else 
            if("hd_"+table.cols[j].key == targetColumnB)
            {
                b_index = j;
            }
        }

        if(a_index != -1 & b_index != -1)
        {
            var temp = table.cols[a_index];
            table.cols[a_index] = table.cols[b_index];
            table.cols[b_index] = temp;
        }

        var a_html = null;
        var b_html = null;
        var a_html_index = -1;
        var b_html_index = -1;

        $('.jsit_row.heading').children('div').each(function () {
            if($(this).attr("id") === sourceColumnA)
            {
                a_html = this;
                a_html_index = $(this).index();
            } else if($(this).attr("id") === targetColumnB)
            {
                b_html = this;
                b_html_index = $(this).index();
            }
        });

        if(a_html !== null && b_html !== null && a_html_index != -1 & b_html_index != -1)
        {
            // Exchange Heading
            $(a_html).css({left: 0});
            $(b_html).css({left: 0});
            var temp_a = $(a_html).clone();
            var temp_b = $(b_html).clone();
            $(a_html).replaceWith(temp_b);    
            $(b_html).replaceWith(temp_a);

            table = addDragEvent($(temp_a), table);
            table = addDragEvent($(temp_b), table);

            for(var k=0; k < $('.jsit_body').children('.jsit_row').length; k++)
            {
                var item = $('.jsit_body').children('.jsit_row')[k];
                var cell_a = $(item).children('.jsit_cell')[a_html_index];
                var cell_b = $(item).children('.jsit_cell')[b_html_index];
                
                var temp_content_a = $(cell_a).clone();
                var temp_content_b = $(cell_b).clone();

                $(cell_a).replaceWith(temp_content_b);    
                $(cell_b).replaceWith(temp_content_a);         
            }        
        }    

        return table;
    }

    var GetScrollBarWidth = function() {
        var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
            widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
        $outer.remove();
        return 100 - widthWithScroll;
    };
    
    $.fn[pluginName] = function (options) {

        var plugin = this.data(dataKey);

        // has plugin instantiated ?
        if (plugin instanceof Plugin) {
            // if have options arguments, call plugin.init() again
            if (typeof options !== 'undefined') {
                plugin.init(options);
            }
        } else {
            plugin = new Plugin(this, options);
            this.data(dataKey, plugin);
        }
        
        return plugin;
    };

}(jQuery, window, document));

/*
$.fn.IronTable = function(options) {

    $(this).on('resize', function() { 
        console.log("resized");
    });
    $.fn.sizeChanged = function (handleFunction) {
        console.log("resized");
    };
      

    var self = this;
    this.body = $('<div class="jsit_body"></div>');
    $(this).html(this.body);

    this.options = options;
    this.columns = [];
    this.rows = [];
    this.headercells = [];
    this.OnInitialized = this.options.OnInitialized;
    this.columnfields = [];

    this.Validate = function(variable)
    {
        var result = false;
        if(variable !== null && typeof variable !== 'undefined')
        {
            result = true;
        }
        return result;
    };    

    this.Reload = function()
    {
        $(this.body).html('');
        this.CreateData();
    };

    this.StartLoader = function()
    {
        $(this.body).html('<div class="jsit_loader_container"><div class="jsit_loader"></div></div>');
    }

    this.Clear = function()
    {
        $(this.body).html("");
        Notify(this.body, "No data available");
    };

    // Create Elements
    if(this.Validate(options))
    {
        var generateheader = true;
        if(this.Validate(options.header))
        {
            if(options.header == false)
            {
                generateheader = false;
            }
        }

        if(generateheader && this.Validate(options.columns))
        {
            $(this).prepend('<div class="jsit_heading"></div>');
            this.heading = this.children(".jsit_heading");

            if(this.Validate(options.fixedheader))
            {
                if(options.fixedheader)
                {
                    $(this.heading).addClass("jsit_fixedheader");
                }
            }
        }
    }

    this.Initialize = function()
    {
        if(this.Validate(this.options))
        {
            // Create Header
            this.CreateHeader();

            // Create Data
            this.CreateData();

            $(window).resize(function(){
                var row = $('<div class="jsit_row heading"></div>');
                for(var p=0; p < row.children().length; p++)
                {
                    var child = row.children()[p];
                    for(var s=0; s < self.headercells.length; s++)
                    {
                        var key = "hd_"+self.headercells[s].column.key;
                        if(key === $(child).attr("id"))
                        {
                            self.headercells[s].sx = $(child).position().left;
                            self.headercells[s].w = $(child).width();
                            break;
                        }
                    }
                }
            });
        } else {
            Notify(this.body, "No options defined");
        }
    };

    this.CreateHeader = function()
    {
        // Create Header
        // ---
        $(this.heading).html("");
        this.columnfields = [];
        if(generateheader && self.Validate(this.options.columns))
        {                        
            var row = $('<div class="jsit_row heading"></div>');
            $(this.heading).append(row);
            
            for(var j=0; j < this.options.columns.length; j++)
            {                
                var col = this.options.columns[j];            
                var column = {  
                    key: col.datafield                           
                };

                var hiddenclass = "";     
                var isvisible = true;   
                if(self.Validate(this.options.columns[j].visible))
                {
                    if(this.options.columns[j].visible)
                    {
                        hiddenclass = "";
                        this.columnfields.push(this.options.columns[j].datafield);
                    } else {
                        isvisible = false;   
                        hiddenclass = " jsit_hiddencol";
                    }
                } else {
                    this.columnfields.push(this.options.columns[j].datafield);
                }

                var addstyle = "";
                if(self.Validate(this.options.columns[j].width))
                {
                    var w = this.options.columns[j].width;
                    if(w.includes("px"))
                    {
                        addstyle = ' style="width: '+this.options.columns[j].width+'; flex: none;"';
                    } else if(w.includes("%"))  
                    {
                        addstyle = ' style="width: '+this.options.columns[j].width+'; flex: none;"';
                    }                                       
                }

                var sortableclass = "";
                if(self.Validate(this.options.sortable))
                {
                    if(this.options.sortable)
                    {
                        sortableclass = ' class="jsit_sortheader" onclick="SortTableByColumn('+j+', this.parentElement);"';
                    }
                }
                
                column.title = this.options.columns[j].title;                    
                var cellvalue = this.options.columns[j].title;

                var datefields_str = "";
                if(self.Validate(this.options.columns[j].datafields))
                {
                    var datafields = this.options.columns[j].datafields;
                    if(datafields.length > 0)
                    {
                        for(var f=0; f < datafields.length; f++)
                        {
                            datefields_str += ' ' + datafields[f].key + '="'+datafields[f].value+'" ';
                        }
                    }
                }
                
                var cell = $('<div id="hd_'+column.key+'" class="jsit_head'+hiddenclass+' jsit_noselect"'+addstyle+'><span'+sortableclass+datefields_str+'>'+cellvalue+'</span><i class="material-icons jsit_ordericon">remove</i></div>');
                row.append(cell);
                self = addDragEvent(cell, self);
                

                var x = cell.position().left;
                self.headercells.push({column: column, html: cell, sx: 0, w: 0, order: j, visible: isvisible});
                
                // Drag Cell Size
                //
                // /createDraggable(cell, this, j);
                

                this.columns.push(column);
            }

            for(var p=0; p < row.children().length; p++)
            {
                var child = row.children()[p];
                for(var s=0; s < self.headercells.length; s++)
                {
                    var key = "hd_"+self.headercells[s].column.key;
                    if(key === $(child).attr("id"))
                    {
                        self.headercells[s].sx = $(child).position().left;
                        self.headercells[s].w = $(child).width();
                        break;
                    }
                }
            }                
        }
        // ---
        // End Create Header
    };

    this.CreateData = function()
    {
        // Create Data
        // ---
        $(this.body).html("");
        if(self.Validate(this.options.data))
        {
            if(this.options.data.length > 0)
            {
                for(var k=0; k < this.options.data.length; k++)
                {
                    var rowclass = "odd";
                    if((k+1) % 2 == 0) rowclass = "even";

                    var row = $('<div class="jsit_row '+rowclass+'"></div>');
                    $(this.body).append(row);                    

                    //for (var key in this.options.data[k])
                    for(var g=0; g < this.options.columns.length; g++)
                    {
                        var found_column_data = false;
                        var mainkey = this.options.columns[g].datafield;

                        var hiddenclass = " jsit_hiddencol";
                        if(this.columnfields.length > 0)
                        {                                
                            for(var p=0; p < this.columnfields.length; p++)
                            {                                
                                if(mainkey === this.columnfields[p])
                                {
                                    hiddenclass = "";
                                    break;
                                }
                            }
                        }

                        var addstyle = "";
                        if(self.Validate(this.options.columns[g].width))
                        {
                            var w = this.options.columns[g].width;
                            if(w.includes("px"))
                            {
                                addstyle = ' style="width: '+this.options.columns[g].width+'; flex: none;"';
                            } else if(w.includes("%"))  
                            {
                                addstyle = ' style="width: '+this.options.columns[g].width+'; flex: none;"';
                            }                               
                        }

                        for (var key in this.options.data[k])
                        {
                            var cellvalue = this.options.data[k][key];                            
                            if(this.options.columns[g].datafield === key)
                            {
                                found_column_data = true;
                                if(self.Validate(this.options.columns[g].view))
                                {
                                    cellvalue = this.options.columns[g].view(this.options.data[k]);                                
                                }

                                var cell = $('<div class="jsit_cell'+hiddenclass+'"'+addstyle+'><span>'+cellvalue+'</span></div>');
                                row.append(cell);

                                break;
                            }
                        }  
                        

                        if(!found_column_data)
                        {
                            var cell = $('<div class="jsit_cell'+hiddenclass+'"'+addstyle+'><span>&nbsp;</span></div>');
                            row.append(cell);
                        }           
                    }
                }

                if(self.Validate(this.options.scrollable) && generateheader)
                {
                    if(this.options.scrollable)
                    {
                        $(this.body).addClass("jsit_scrollbody");
                        //$(this.body).css("max-height", this.options.bodyheight - $(this.heading).height() );

                        if($(this.body).hasScrollBar())
                        {
                            $(this.heading).css("padding-right", GetScrollBarWidth());
                        }
                    }
                }
            } else {
                Notify(this.body, "No data available");
            }            
        } else {
            Notify(this.body, "No data available");
        }
        // ---
        // End Create Data
    };

    this.ResetHeaderIcons = function()
    {        
        for(var f=0; f < this.headercells.length; f++)
        {
            console.log($(this.headercells.html));
        }
        //$(icon_element).html("remove");
    }
    

    if(this.OnInitialized !== null && typeof this.OnInitialized !== 'undefined')
    {
        this.OnInitialized();
    }

    return this;
}*/

/*
function Notify(target, text)
{
    $(target).html('<div class="emptytable">'+text+'</div>');
}*/

/*
(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);
*/

/*
function GetScrollBarWidth () {
    var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
        widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
    $outer.remove();
    return 100 - widthWithScroll;
};*/

/*
function SortTableByColumn(n, caller) {
    if(!$(caller).hasClass("dragging"))
    {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;

        table = $(caller).parent().parent().parent();
        switching = true;
        dir = "asc";

        var all_icon_elements = table.children(".jsit_heading").children(".jsit_row")[0];
        for(var g=0; g < $(all_icon_elements).children(".jsit_head").length; g++)
        {
            var head = $(all_icon_elements).children(".jsit_head")[g];
            var head_icon_elemen = $(head).children(".jsit_ordericon")[0];
            $(head_icon_elemen).html("remove");
        }

        var icon_element = $(caller).children(".jsit_ordericon")[0];
    
        while (switching) {
          switching = false;
          rows = $(table).find(".jsit_body").children(".jsit_row");
    
          for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
    
            x = $(rows[i]).children(".jsit_cell")[n];
            y = $(rows[i + 1]).children(".jsit_cell")[n];
    
            x = $(x).children("span");
            y = $(y).children("span");
    
            if (dir == "asc") {
                $(icon_element).html("keyboard_arrow_down");
                if($.isNumeric(  ) )
                {
                    if (Number($(x).html()) > Number($(y).html())) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if($(x).html() != null && typeof $(x).html() != 'undefined')
                    {
                        if ($(x).html().toLowerCase() > $(y).html().toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }                    
                }              
            } else if (dir == "desc") {
                $(icon_element).html("keyboard_arrow_up");
                if($.isNumeric( $(x).html() ) )
                {
                    if (Number($(x).html()) < Number($(y).html())) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if($(x).html() != null && typeof $(x).html() != 'undefined')
                    {
                        if ($(x).html().toLowerCase() < $(y).html().toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }                    
                }              
            }
          }
          if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++; 
          } else {
            if (switchcount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
            }
          }
        }

        // Now remove all classes Odd or Even ad re add them
        for(var t=0; t < rows.length; t++)
        {
            $(rows[t]).removeClass("odd");
            $(rows[t]).removeClass("even");

            var rowclass = "odd";
            if((t+1) % 2 == 0) rowclass = "even";
            $(rows[t]).addClass(rowclass);
        }
    }
    
}*/

// NEW
/*
function addDragEvent(cell, table)
{
    $( cell ).draggable(
    { 
        axis: "x",
        containment: "parent",
        start: function(ev,ui) {
            this.ax = $(ev.target).position().left;
        },
        drag: function(ev,ui) {
            $(ev.target).addClass("dragging");            
        },
        stop: function(ev,ui) {        
            setTimeout(function()
            {
                $(ev.target).removeClass("dragging");
            }, 500);

            var a_x = -1;
            var a_index = -1;
            var b_x = -1;
            var b_index = -1;
            
            a_x = $(ev.target).position().left;
            
            var headercells = $(ev.target).parent().children(".jsit_head");
            for(var j=0; j < headercells.length; j++)
            {
                var currentheader = headercells[j];
                var currentheader_x = $(currentheader).position().left;
                var currentheader_w = $(currentheader).outerWidth();
                
                if((a_x >= currentheader_x) && a_x < (currentheader_x + currentheader_w) && $(ev.target).attr("id") != $(currentheader).attr('id'))
                {
                    // console.log("B LEFT: "+currentheader_x);
                    //console.log("A: "+$(ev.target).attr("id"));
                    //console.log("B: "+$(currentheader).attr('id'));

                    var resulttable = ExchangeColumns($(ev.target).attr("id"), $(currentheader).attr('id'), table); 
                    table = resulttable;
                    break;
                }
            }

            $(this).css({left: 0});
        }
    });

    return table;
}*/

// OLD
/*
function addDragEvent(cell, table)
{
    $( cell ).draggable(
    { 
        axis: "x",
        containment: "parent",
        start: function(ev,ui) {
            
        },
        drag: function(ev,ui) {
            $(ev.target).addClass("dragging");
        },
        stop: function(ev,ui) {        
            setTimeout(function()
            {
                $(ev.target).removeClass("dragging");
            }, 500);

            var a_x = -1;
            var a_index = -1;
            var b_x = -1;
            var b_index = -1;
            

            for(var k=0; k < table.headercells.length; k++)
            {
                if("hd_"+table.headercells[k].column.key === $(ev.target).attr("id"))
                {
                    a_x = table.headercells[k].sx;    
                    a_index = k;                                                
                }
            }

            for(var k=0; k < table.headercells.length; k++)
            {                
                var keyname = "hd_"+table.headercells[k].column.key;
                if(table.headercells[k].visible && $(ev.target).attr("id") !== keyname)
                {
                    if(parseInt(ev.pageX) >= parseInt(table.headercells[k].sx) &&
                    parseInt(ev.pageX) < (parseInt(table.headercells[k].sx) + parseInt(table.headercells[k].w)) )
                    {
                        b_x = parseInt(table.headercells[k].sx);
                        b_index = k;

                        console.log("Found: ");
                        //console.log(keyname); 
                        //console.log($(ev.target).attr("id")); 
                        
                        console.log("a_x: "+a_x);
                        console.log("a_index: "+a_index);
                        console.log("b_x: "+b_x);
                        console.log("b_index: "+b_index);

                        var resulttable = ExchangeColumns($(ev.target).attr("id"), keyname, table); 
                        table = resulttable;

                        table.headercells[b_index].sx = a_x;
                        table.headercells[a_index].sx = b_x;
                        
                        //console.log(table.columns);
                    }
                }                                                    
            }

            $(this).css({left: 0});
        }
    });

    return table;
}
*/


/*
function createDraggable(target, table, columnindex){    
    var div = $("<div></div>");
    $(target).append(div);
    
    $(div).css("top",'0');
    $(div).css("right",'-18px');
    $(div).css("width",'30px');
    $(div).css("position",'absolute');
    $(div).css("cursor",'col-resize');
    //$(div).css("backgroundColor",'red');
    $(div).css("userSelect",'none');
    $(div).css("z-index",'10000');
    $(div).css("height",target.outerHeight()+'px');
    $(div).attr('class', 'jsit_columnSelector');

    $(div).mousedown(function(){
        target.candrag = true;
        target.dragstartX = event.clientX;
    });

    $(window).mouseup(function(){
        target.candrag = false;
    });

    $(div).mouseleave(function(){
        //target.candrag = false;
        console.log("Leave");
    });

    $(div).mousemove(function(event){
        if(target.candrag)
        {
            var dragendX = event.clientX;
            var deltatX = dragendX - target.dragstartX;
            target.dragstartX = dragendX;

            var widthcss = $(target).css("flex-basis");
            if(widthcss == null || typeof widthcss == 'undefined') widthcss = 0;
            
            if(widthcss.includes("px"))
            {
                var w = widthcss.replace("px", "");
            } else if(widthcss.includes("%"))
            {
                var w = widthcss.replace("%", "");
            }
            var new_w = Number(w) + deltatX * 1.5;
            //$(target).css("width", new_w);

            ResizeColumnCells(columnindex, table, target, new_w);
        }        
    });

    return div;
}
*/


/*
function ResizeColumnCells(columnindex, table, headercell, new_w)
{
    $(headercell).css("flex-basis", new_w);

    var rows = $(table.body).children('.jsit_row');
    for(var k=0; k < rows.length; k++)
    {
        var row = rows[k];
        var cells = $(row).children(".jsit_cell");

        if(columnindex > 0 && columnindex < cells.length)
        {
            var cell = cells[columnindex];
            $(cell).css("flex-basis", new_w);
        }
    }
}
*/

/*
function ExchangeColumns(sourceColumnA, targetColumnB, table)
{
    console.log("ExchangeColumns");
    var a_index = -1;
    var b_index = -1;
    for(var j=0; j < table.columns.length; j++)
    {
        if("hd_"+table.columns[j].key == sourceColumnA)
        {
            a_index = j;
        } else 
        if("hd_"+table.columns[j].key == targetColumnB)
        {
            b_index = j;
        }
    }

    if(a_index != -1 & b_index != -1)
    {
        var temp = table.columns[a_index];
        table.columns[a_index] = table.columns[b_index];
        table.columns[b_index] = temp;
    }

    var a_html = null;
    var b_html = null;
    var a_html_index = -1;
    var b_html_index = -1;

    $('.jsit_row.heading').children('div').each(function () {
        if($(this).attr("id") === sourceColumnA)
        {
            a_html = this;
            a_html_index = $(this).index();
        } else if($(this).attr("id") === targetColumnB)
        {
            b_html = this;
            b_html_index = $(this).index();
        }
    });

    if(a_html !== null && b_html !== null && a_html_index != -1 & b_html_index != -1)
    {
        // Exchange Heading
        $(a_html).css({left: 0});
        $(b_html).css({left: 0});
        var temp_a = $(a_html).clone();
        var temp_b = $(b_html).clone();
        $(a_html).replaceWith(temp_b);    
        $(b_html).replaceWith(temp_a);

        table = this.addDragEvent($(temp_a), table);
        table = this.addDragEvent($(temp_b), table);

        for(var k=0; k < $('.jsit_body').children('.jsit_row').length; k++)
        {
            var item = $('.jsit_body').children('.jsit_row')[k];
            var cell_a = $(item).children('.jsit_cell')[a_html_index];
            var cell_b = $(item).children('.jsit_cell')[b_html_index];
            
            var temp_content_a = $(cell_a).clone();
            var temp_content_b = $(cell_b).clone();

            $(cell_a).replaceWith(temp_content_b);    
            $(cell_b).replaceWith(temp_content_a);         
        }        
    }    

    return table;
}*/