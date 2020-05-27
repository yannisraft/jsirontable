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
            columnfields: []
        };
        
        this.init(options);
    };

    Plugin.prototype = {
        init: function (options) {
            $.extend(this.options, options);
            
            var self = this;
            this.body = $('<div class="jsit_body"></div>');
            this.element.html(this.body);

            this.listeners = {};
            this.rows = [];
            this.cols = [];
            this.headercells = [];            
            this.columnfields = [];
            this.initialHeight = 0;

            // Create Elements
            setTimeout(function()
            {
                try
                {
                    if(self.Validate(options))
                    {
                        self._generateheader = true;
                        if(self.Validate(options.header))
                        {
                            if(options.header == false)
                            {
                                self._generateheader = false;
                            }
                        }
                        
                        if(self._generateheader && self.Validate(options.columns))
                        {
                            //console.log("JSIronTable Log: Found existing header.. deleting!");
                            //console.log("self.element.find('.jsit_heading).length: "+$(self.element).find('.jsit_heading').length);
                            if($(self.element).find('.jsit_heading').length !== 0)
                            {
                                $(self.element).find('.jsit_heading').remove();                                
                            }
                            
                            self.heading = $('<div class="jsit_heading"></div>');
                            self.element.prepend(self.heading);
        
                            if(self.Validate(options.fixedheader))
                            {
                                if(options.fixedheader)
                                {
                                    $(self.heading).addClass("jsit_fixedheader");
                                }
                            }
                        }
        
                        // Create Header
                        self.CreateHeader();
        
                        // Create Data
                        self.CreateData();
        
                        self.initialHeight = self.element.height();
        
                        self.FitSize();
                        $(window).resize(function() {                    
                            self.FitSize();
                        });

                        if(self.Validate(self.listeners))
                        {
                            if(self.Validate(self.listeners.OnInitialized))
                            {
                                if(typeof self.listeners.OnInitialized === "function")
                                {
                                    self.listeners.OnInitialized();
                                }
                            }
                        }                    
                    } else {
                        Notify(self, "No options defined");
                    }
                } catch(ex)
                {
                    ThrowError(self ,ex);
                }  
            },200);                      
        },

        OnInitialized(callback)
        {
            this.listeners.OnInitialized = callback;
        },

        OnError(callback)
        {
            this.listeners.OnError = callback;
        },

        OnSort(callback)
        {
            this.listeners.OnSort = callback;
        },

        BeforeSort(callback)
        {
            this.listeners.BeforeSort = callback;
        },

        OnReload(callback)
        {
            this.listeners.OnReload = callback;
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

            if(this.listeners.OnReload !== null && typeof this.listeners.OnReload !== 'undefined' && typeof this.listeners.OnReload === "function")
            {
                this.listeners.OnReload();
            }            
        },

        StartLoader: function()
        {
            $(this.body).html('<div class="jsit_loader_container"><div class="jsit_loader"></div></div>');
        },

        Clear: function()
        {
            $(this.body).html("");
            var nodatatxt = "No data available";
            if(this.Validate(this.options))
            {
                if(this.Validate(this.options.nodatatext))
                {
                    nodatatxt = this.options.nodatatext;
                }
            }
            
            Notify(this, nodatatxt);
        },

        GetRows: function()
        {
            //var allrows = this.rows.map(function(item) { return item["data"]; });
            var allrows = this.rows;
            return allrows;
        },

        GetRow: function(func)
        {
            return this.rows.find(func);
        },

        RemoveRow: function(row)
        {
            var arr = this.options.data;
            var entry = null;
            for(var k=0; k < arr.length; k++)
            {
                if(arr[k] == row.data)
                {
                    entry = k;
                    break;
                }
            }
            
            if(entry !== null && typeof entry !== 'undefined')
            {
                this.options.data.splice(entry, 1);
                this.Reload();
            }
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
                    
                    var span =  $('<span'+sortableclass+datefields_str+'>'+cellvalue+'</span><i class="material-icons jsit_ordericon">swap_vert</i>');
                    // Add On click listener to the header
                    //
                    $(span).click(function(e) {
                        var targ = e.target.id;
                        var lastChar = targ.charAt(targ.length - 1);
                        e.preventDefault();
                        self.SortTableByColumn(lastChar, this.parentElement);
                    });                    
                    
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
            this.rows = [];

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

                        var row_element = $('<div class="jsit_row '+rowclass+'"></div>');
                        $(this.body).append(row_element);

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
                                        cellvalue = this.options.columns[g].view(this.options.data[k], row_element);                                
                                    }

                                    var cell = $('<div class="jsit_cell'+hiddenclass+'"'+addstyle+'><span>'+cellvalue+'</span></div>');
                                    row_element.append(cell);

                                    break;
                                }
                            }
                    
                            if(!found_column_data)
                            {
                                var cell = $('<div class="jsit_cell'+hiddenclass+'"'+addstyle+'><span>&nbsp;</span></div>');
                                row_element.append(cell);
                            }
                        }

                        row_element.data("values", this.options.data[k]);

                        this.rows.push({element: row_element, data: this.options.data[k]});
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
                    var nodatatxt = "No data available";
                    if(this.Validate(this.options))
                    {
                        if(this.Validate(this.options.nodatatext))
                        {
                            nodatatxt = this.options.nodatatext;
                        }
                    }
                    
                    Notify(this, nodatatxt);
                }            
            } else {
                var nodatatxt = "No data available";
                if(this.Validate(this.options))
                {
                    if(this.Validate(this.options.nodatatext))
                    {
                        nodatatxt = this.options.nodatatext;
                    }
                }
                
                Notify(this, nodatatxt);
            }            
        },
        // ---
        // End Create Data

        SortTableByColumn(n, caller) {
            if(!$(caller).hasClass("dragging"))
            {
                this.listeners.BeforeSort();

                var table = $(caller).parent().parent().parent();
                var dir = "asc";
                var dir_value = 1;

                var icon_element = $(caller).children(".jsit_ordericon")[0];
                if($(icon_element).html() == "keyboard_arrow_down")
                {
                    dir = "desc";
                } else {
                    dir = "asc";
                    dir_value = -1;
                }

                if (dir == "asc") {
                    $(icon_element).html("keyboard_arrow_down");
                }  else if (dir == "desc") {
                    $(icon_element).html("keyboard_arrow_up");
                }

                var id = $(caller).attr('id');
                var column_param = id.replace("hd_","");

                function compare( a, b ) {
                    if ( a[column_param] < b[column_param] ){
                      return -1 * dir_value;
                    }
                    if ( a[column_param] > b[column_param] ){
                      return 1 * dir_value;
                    }
                    return 0;
                }                

                this.options.data.sort( compare );
                this.Reload();

                if(this.listeners.OnSort !== null && typeof this.listeners.OnSort !== 'undefined' && typeof this.listeners.OnSort === "function")
                {
                    this.listeners.OnSort();
                }
                

                /*
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
                }*/
        
                // Now remove all classes Odd or Even ad re add them
                /* for(var t=0; t < rows.length; t++)
                {
                    $(rows[t]).removeClass("odd");
                    $(rows[t]).removeClass("even");
        
                    var rowclass = "odd";
                    if((t+1) % 2 == 0) rowclass = "even";
                    $(rows[t]).addClass(rowclass);
                } */
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
        var datafields_str ="";
        if(target.options !== null && typeof target.options !== 'undefined')
        {
            if(target.options.nodata_datafields !== null && typeof target.options.nodata_datafields !== 'undefined')
            {
                var datafields = target.options.nodata_datafields;
                if(datafields.length > 0)
                {
                    for(var f=0; f < datafields.length; f++)
                    {
                        datafields_str += ' ' + datafields[f].key + '="'+datafields[f].value+'" ';
                    }
                }
            }
        }
        
        $(target.body).html('<div class="emptytable"'+datafields_str+'>'+text+'</div>');
    };

    var ThrowError = function(target, error)
    {        
        if(target.Validate(target.listeners))
        {
            if(target.Validate(target.listeners.OnError))
            {
                if(typeof target.listeners.OnError === "function")
                {
                    target.listeners.OnError(error);
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