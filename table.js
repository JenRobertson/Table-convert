$("#preview").fadeToggle(0);
$("#preview_button").fadeOut(0);
$("#footer").slideUp(0);

	colours = ["#fbdae3","#f7ec8e","#c0ffb8","#fed7b6","#aeecfb","#d67cde","#d7d2e9","#c9ac9f","#ceb3d4","#dbdc89","#7c8ade","#fbdae3","#fed7b6","#f7ec8e","#c0ffb8","#aeecfb","#d67cde","#d7d2e9","#c9ac9f","#ceb3d4","#dbdc89","#7c8ade","#fbdae3","#fed7b6","#f7ec8e","#c0ffb8","#aeecfb","#d67cde","#d7d2e9","#c9ac9f","#ceb3d4","#dbdc89","#7c8ade"];

var original_html = "";	

$(document).ready(function(){
	$(".grey").click(function(){
		$("#footer").slideToggle(200);
	});

	$( "#inputbox" ).focus(function() {//background image of input box
 		$( "#inputbox" ).removeClass( "table_bg" );
	});

	$("#clear").click(function(){
		$("#inputbox").html("");
		$("#preview_button").fadeOut(300);
	});

	$(document).on('focus', '.row_num', function()	{//must be set up this way to apply to dynamically created buttons
		$( this ).siblings(".setting_thead").attr('checked', true);
	});

	$(document).on('focus', '.input_class', function()	{//must be set up this way to apply to dynamically created buttons
		$( this ).siblings(".setting_class").attr('checked', true);
	});

	$(document).on('click', '.select', function()	{//must be set up this way to apply to dynamically created buttons
		$( this ).siblings(".preview_textarea").select();
	});

	$(document).on('click', '.setting_caption', function()	{
		$( this ).siblings(".caption").slideToggle(200);
	});

	$(document).on('click', '.setting_summary', function()	{
		$( this ).siblings(".summary").slideToggle(200);
	});

	$(document).on('click', '.setting_tfoot', function()	{
		$( this ).siblings(".tfoot").slideToggle(200);
	});

	$(document).on('click', '.plus', function()	{
		$( this ).prev().before(class_html)
		$(".error2").fadeOut(0)
		$(".error4").fadeOut(0)
	});

	$("#demo").click(function(){
		$('#inputbox').html($('#demo_div').html()) ;
	});

	$(document).on('click', '.setting_thead', function()	{
		$( this ).siblings('.tfoot_span').fadeToggle()//thead;
	});
//************************************************************************************SUBMIT****************************************************************************************

	$("#submit").click(function(){//when 'generate html clicked'
		$("#gradient").remove();

		
		if ($('#setting_html').is(':checked')){
			original_html = $('#inputbox').text();//get input for html mode
			$('#setting5').attr('checked', false);

		}
		else{
			original_html = $('#inputbox').html();//get input for word mode


		original_html = original_html.replace(/(<\/?\w:(.|\n)*?>|<(\/?)u>)/g, "");//remove o:p etc because it was causing weird web page problems
		original_html = original_html.replace(/<\/?\w*:.*?>/g, "");//remove all tags with a colon inside!!!
		original_html = original_html.replace(/style/g, "");//remove all styles
		original_html = original_html.replace(/<img.*?>/g, "");//remove all images
		original_html = original_html.replace(/<\/?div.*?>/g, "");//remove divs
		$('#inputbox').html(original_html);//output back out to div
		}
	

		//break up into separate strings
		//for each string in array, generate html
		$( "#preview_div" ).empty();
		$("#preview").fadeIn(1100);//fade in the div

		split_original_html = original_html.match(/<table[\S\s]*?>[\S\s]*?<\/table>/g)//split string up in to tables

		if(split_original_html == null){//test if table found 
			$("#preview_div").html("<h3>No table found </h3><img src='images/sad_cat.png' alt='Sad cat'>")
		} else { 
			for (var i = 0; i < split_original_html.length; i++) {
			    generate_html(split_original_html[i], i )
			    
			}
		}	

	});//*on submit





});//**document.ready
//*********************************************************************************************APPLY*****************************************************************************************

	$(document).on('click', '.apply_button', function()	{//must be set up this way to apply to dynamically created buttons
		this_table_string = $( this ).siblings(".hidden").text();//get value - hidden value is used so that the original table is always used, rather than changes stacking ontop of each other
		var tr_array = this_table_string.match(/<tr>[\S\s]*?<\/tr>/g);//search for number of <tr> in table and save as an array
		tr = tr_array.length// tr is number of rows in this table
		//td is numbr of columns(max)

	
	
		this_table_string = expand_Colspan(this_table_string)
	

		// EXPAND ROWSPAN	

		// tr_array = this_table_string.match(/<tr>[\S\s]*?<\/tr>/g);//search for number of <tr> in table and save as an array THIS BROKE IT

		for (i = 0; i < tr_array.length; i++){
			if (tr_array[i].match(/rowspan/) != null ){//if this tr contains rowspan
				column = i + 1
			
			 	td_array = tr_array[i].match(/<td.*<\/td>/g)
			 	for (a = 0; a < td_array.length; a++){
			 		if (td_array[a].match(/rowspan/) != null ){//if this td contains rowspan
			 		row = a + 1
			 		num = td_array[a].match(/rowspan="\d\d?"/)
			 		num = num[0].match(/\d\d?/)
			 		

				 		for (b = 0; b < (num-1); b++){				
	
				 		this_table_string = add_Cell(this_table_string,row,(column + b))
				 		}
				 			
			 		}
			 	}
			}
		}

		tr_array = this_table_string.match(/<tr>[\S\s]*?<\/tr>/g);//search for number of <tr> in table and save as an array
		tr = tr_array.length// tr is number of rows in this table



		//find number of columns
		var td = 0;
		for (i = 0; i < tr_array.length; i++){
			var td_array = tr_array[i].match(/<\/td>/g)
			
			if(td_array.length > td){
				td = td_array.length
			}

		}
	

		//settings
			

			//CLASSES 
			var class_names = ["0"];
			$( this ).siblings('.span_class').children('.setting_class').each(function (index, currentObject) {//interate through each instance of class settings span

			 if ($(currentObject).is(':checked')){ //if the check box is checked
			 	var num = $( this ).siblings('.num_class').val()

		 		if (  isNaN(num) | num == "" | num < 1)//if number is invalid
				{
					//shows error message if invalid number entered 
					$( this ).siblings( ".num_class" ).addClass( "red" );
					$( this ).siblings( ".error2" ).fadeIn();								
				} else {
					//remove error message
					$( this ).siblings( ".num_class" ).removeClass( "red" );
					$( this ).siblings( ".error2" ).fadeOut();

					var this_input_class = $( this ).siblings('.input_class').val()
					//check if class name is valid
					regex = /^[a-zA-Z][a-zA-Z0-9_\-]*$/;
					// regex.test(this_input_class)
					
					if (regex.test(this_input_class) == false){
						//shows error message if invalid class entered 
						$( this ).siblings( ".input_class" ).addClass( "red" );
						$( this ).siblings( ".error4" ).fadeIn();	
					}
					else{
						//remove error message
						$( this ).siblings( ".input_class" ).removeClass( "red" );
						$( this ).siblings( ".error4" ).fadeOut();	
						

						if ($( this ).siblings( ".class_select" ).val() == "row"){
							if(num <= tr){//do not run if number is greater than number of rows in the table
								var row_reg = new RegExp( "((<tr>(\\s|.)*?<\/tr>\\s*?){"+ (num-1) + "}<tr)(>(\\s|.)*?(<td>(\s|.)*?<\/td>\\s*)+)", "" );

								this_table_string = this_table_string.replace(row_reg,'$1abc$4')//add 'abc' to the correct <tr>
								

								row_class = this_table_string.match(/<trabc>[\S\s]*?<\/tr>/)//save out the <tr>

								row_class = row_class[0].replace(/(<td.*?)>/g,'$1 class="word_table_to_html_highlight_' + index + '_' + this_input_class + '">')//add the class names to the <td>s 
								row_class = row_class.replace(/trabc/,"tr")//remove the abc
								this_table_string=this_table_string.replace(/<trabc>[\S\s]*?<\/tr>/,row_class)//put new row back into main string	
							}	

						} else if(num <= td) {//column
							var column_reg = new RegExp( "(<tr>(\\s*<td.*?<\/td>(\\s)*?){" + (num-1) + "}\\s*<td.*?)(>(\\s|.)*?<\/td>)", "g" );

							this_table_string = this_table_string.replace(column_reg,'$1 class="word_table_to_html_highlight_' + index + '_' + this_input_class + '"$4' );
						
						}





						//sort out repeated classes used in the class panel
						if ($.inArray(this_input_class, class_names) == -1){
							// alert(this_input_class + " is not a repeat class")
							class_names[index] = this_input_class;
							var regex = new RegExp( '(class="word_table_to_html_highlight_'+ index + "_" + this_input_class + '"(.*")*)', "g" )			
							this_table_string = this_table_string.replace(regex, '$1 style="background-color:' + colours[index] + '"');//add on colours
							$(currentObject).parent('.span_class').children('.input_class').attr('style', 'background-color:' + colours[index]);

						} else {
							// alert(this_input_class + " is a repeat class")

							var regex = new RegExp( '(class="word_table_to_html_highlight_'+ index + "_" + this_input_class + '"(.*")*)', "g" )			
							this_table_string = this_table_string.replace(regex, '$1 style="background-color:' + colours[$.inArray(this_input_class, class_names)] + '"');//add on colours
							$(currentObject).parent('.span_class').children('.input_class').attr('style', 'background-color:' + colours[$.inArray(this_input_class, class_names)]);
						}
					}//class name check

				}//NAN check	
			
			}//if checked

		});//for each setting class

	

		

		if ($( this ).siblings('.setting_thead').is(':checked')){//thead;


				
				var row_num = $( this ).siblings('.row_num').val()//get row number value from form
		
				if (  isNaN(row_num) | row_num == "" | row_num < 1)//if number is invalid
				{
					//shows error message if invalid number entered 
					$( this ).siblings( ".row_num" ).addClass( "red" );
					$( this ).siblings( ".error" ).fadeIn();								
				} else {
					//remove error message
					$( this ).siblings( ".row_num" ).removeClass( "red" );
					$( this ).siblings( ".error" ).fadeOut();

					

					if (tr_array == null){
					//if there are no <tr> in table, do nothing
					} else {
					//test if thead number entered is higher than number of rows in table
						
						if (row_num < tr){
							this_table_string = generate_thead(row_num, this_table_string);

						} else {
							this_table_string = generate_thead(tr, this_table_string);//do maximum number
					}

				}

			}

		}

		if ($( this ).siblings('.setting_span').is(':checked')){ //disable colspan and rowspan
			this_table_string = this_table_string.replace(/ (col|row)span="\d\d?\d?"/g, "");//remove col and row span
		}
	
		if ($( this ).siblings('.tfoot_span').children('.setting_tfoot').is(':checked')){ //tfoot
		
			var tfoot = '<\/thead>\n<tfoot>\n <tr>\n  <td colspan="' + 	td  +'">' + encode($( this ).siblings('.tfoot_span').children('.tfoot').val(),2) + '<\/td>\n <\/tr>\n<\/tfoot>\n<tbody>'
			this_table_string = this_table_string.replace(/<\/thead>\s<tbody>/g, tfoot);
		
		}

		if ($( this ).siblings('.setting_caption').is(':checked')){ //captions
			var caption = '<table> \n <caption>' + encode($( this ).siblings('.caption').val(),2) + '</caption>'
			this_table_string = this_table_string.replace(/<table>/g, caption);
		}

		if ($( this ).siblings('.setting_summary').is(':checked')){ //summary
			var summary = '<table summary="' + encode($( this ).siblings('.summary').val(),2) + '">'
			this_table_string = this_table_string.replace(/<table>/g, summary);
		}

		


		//REMOVE EXTRA ROWS 
		this_table_string = this_table_string.replace(/\n?<t(d|h) .*?empty.*?><\/t(d|h)>/g,"")
		// this_table_string = this_table_string.replace(/span/g,"spoon")


		//save it as two
		var div_string = this_table_string 
		var textarea_string = this_table_string


		//CLEAN UP TEXT FOR OUTPUT TO DIV

		div_string = div_string.replace(/class="[\S\s]*?" ?/g, "");//remove class prefix

		while (div_string.match(/(style="background-color:#.*?)" ?style="background-color:(#.*?)"/g) != null){
			div_string = div_string.replace(/(style="background-color:#.*?)" ?style="background-color:(#.*?)"/g, '$1, $2"')//combine background colours into one
		}

		
		div_string = div_string.replace(/background-color:(.*?)">/g, 'background: linear-gradient(to right, $1)">')//create gradient

		div_string = div_string.replace(/background: linear-gradient\(to right, (#\w{6})\)/g,'background-color: $1')//remove gradient for single colours


		if ($( this ).siblings('form').children('.stripes').is(':checked')){
		//STRIPES
		var stripes = 'style = "background: repeating-linear-gradient(90deg, $1 0px, $1 10px, $2 10px, $2 20px, $3 20px, $3 30px, $4 30px, $4 40px, $5 40px, $5 50px, $6 50px, $6 60px, $7 60px, $7 70px, $8 70px, $8 80px, $9 80px, $9 90px'
		div_string = div_string.replace(/style="background: linear-gradient\(to right, (#\w{6}), (#\w{6})?,? ?(#\w{6})?,? ?(#\w{6})?,? ?(#\w{6})?,? ?(#\w{6})?,? ?(#\w{6})?,? ?(#\w{6})?,? ?(#\w{6})?,? ?/g,stripes)//
	
		div_string = div_string.replace(/,?  \d\d\d?px,?/g,'')//remove excess pixels
		//***end of stripes
		}
		

		//CLEAN UP TEXT FOR OUTPUT TEXT AREA
		textarea_string = textarea_string.replace(/word_table_to_html_highlight_\d+_/g, "");//remove class prefix
		textarea_string = textarea_string.replace(/ ?style=".*?"/g, "");//remove style

		// div_string = div_string.replace(/&lt;/g, "<");
		// div_string = div_string.replace(/&gt;/g, ">");

		//while it can find two different classes in one row
		while (textarea_string.match(/class="((\w|\d|\s)*)" \s*?class="((\w|\d|\s)*)"/g) != null){

			textarea_string = textarea_string.replace(/class="((\w|\d|\s)*)" \s*?class="((\w|\d|\s)*)"/g, 'class="$1 $3"');//combine multiple classes into one class tag
		}

		//REMOVE DUPLICATE CLASSES IN TEXT AREA CODE
		var row_classes = textarea_string.match(/class=".*?"/g)//first find each class attribute

		//for each class attribute, extract the class names as an array (split_classes)
		if (row_classes != null){
			$.each(row_classes, function(i, element){
	    		var split_classes = element.split('"')//splits into class=" and the classes
				split_classes = split_classes[1].split(' ')//splits the classes by space

				//remove duplicates and add classes back into code
				textarea_string = textarea_string.replace(element,'class="' + remove_Duplicates(split_classes).join(" ") + '"')
			});
		}

		//OUTPUT EVERYTHING
		$( this ).siblings(".preview_textarea").text(textarea_string);//output result back into textarea
		$( this ).closest(".preview_divider").find(".preview_table").html(div_string);//output result back into div

		

	});//*******************APPLY*
function generate_thead(num, table_string){

			
	var regex = new RegExp( "<tbody>(((.|\\s)*?<\/tr>){" + num + "})", "" );
	var thead = regex.exec(table_string)[0];//save header-section-to-be as 'thead'

	thead = thead.replace(regex, "<thead>$1\n</thead>\n<tbody>");//add in thead tags
	thead = thead.replace(/<(\/?)td/g, "<$1th");//replace td with th
	thead = thead.replace(/<th>&nbsp;<\/th>/g, "<td>&nbsp;</td>")//replace empty th with td
	thead = thead.replace(/<th(>| )/g, '<th scope="col"$1');//add scope
	table_string = table_string.replace(regex, thead);//replace first row with the new header
	return table_string;

}



class_html = '<span class="span_class">'
class_html += '<br><input type="checkbox" class="setting_class" name="setting_class">'
class_html += 'Add <span class="courier">&#60;class="</span><input type="text" class="input_class courier centre" placeholder="e.g left"><span class="courier">"&#62;</span>'
class_html += '	 to <select class="class_select">  <option value="column">Column</option>  <option value="row">Row</option></select> '
class_html += 'number <input type="text" maxlength="2" class="num_class tiny_input" value="1"> '
class_html +='	<span class="error4"><br>Please enter a valid class name. (Must begin with a letter and contain (A-Za-z0-9_-)</span>'
class_html += '	<span class="error2"><br>Please enter a number between 1 and 99</span>'
class_html += '</span>'


function generate_html(table_string, n){







	if ($('#setting7').is(':checked')){//use col spans 
		table_string = table_string.replace(/<td.*?(\w\w\wspan="\d")( ?\w\w\wspan="\d")?.*?>/g, "<$1$2>");//find and protect the col span rows by renaming them to their col spans

		clean_inside();
		table_string = table_string.replace(/(\w\w\wspan="\d")( ?\w\w\wspan="\d")?/g, "td $1$2");//change the col spans back to tds (now with the col span)
	} else {
		clean_inside();
	}

	console.log(table_string)

	function clean_inside(){
		table_string = table_string.replace(/<(table|td|b|i|tr|p|strong|span|br|h\d)[\S\s]*?>/g, '<$1>');//clean all of inside of tags 
		table_string = table_string.replace(/<\/?h\d>/g, '');//clean all of inside of tags 
	}

	if ($('#setting_br1').is(':checked')){
	table_string = table_string.replace(/<\/p>\s*<p>/g, "<br>");//br settings (<br>)
	table_string = table_string.replace(/<br ?\/>/g, "<br>");//br settings (<br>)
	}

	if ($('#setting_br2').is(':checked')){
		table_string = table_string.replace(/<\/p>\s*<p>/g, "<br/>");//br settings (<br/>)
			table_string = table_string.replace(/<br ?>/g, "<br/>");//br settings (<br>)
	}

	if ($('#setting_br3').is(':checked')){
		table_string = table_string.replace(/<\/p>\s*<p>/g, "");//br settings (neither)
		table_string = table_string.replace(/<\/?br>/g, "");
	}

	//removing things

	//removing white space
	table_string = table_string.replace(/([^>\s])\s\s\s/g, "$1 ");
	table_string = table_string.replace(/(<td.*>)\s*(.*)\s*(<\/td>)/g, "$1$2$3");
	table_string = table_string.replace(/ \s\s/g, "");//remove blank lines
	table_string = table_string.replace(/ \s\s/g, "");//remove more line breaks

	//remove extra weird table at start of table
	table_string = table_string.replace(/<table>[\S\s]+<table>/g, "<table>");//remove more line breaks

	// table_string = table_string.replace(/<td>\n+\s*/g, "<td>");//old one which did not work for colspan

	table_string = table_string.replace(/<!--\[(end)?if.*-->/g, "");//remove if and endif statements 
	table_string = table_string.replace(/(&nbsp;\s*){2,}/g, "&nbsp;");//remove multiple &nbsp;
	table_string = table_string.replace(/<\/?(a|font).*?>/g, "");//remove a, font tag 

	//formatting		
	table_string = table_string.replace(/<td>(.*)\s*?<\/td>/g, "<td>$1</td>");//move <td> tags onto same line as content
	table_string = table_string.replace(/(<\/?tbody>)/g, "$1\n");//move tbody on to new line


	//put all on the same line
	table_string = table_string.replace(/\n/g, "");
	table_string = table_string.replace(/(\s*<(\/tr|\/table|\/tbody|td|tr|tbody|thead|\/thead).*?>)/g, "\n$1");

	//SORTING OUT THEAD
	//remove thead if one came with it
	table_string = table_string.replace(/<(\/?)thead\s*>/g, "");
	
	table_string = table_string.replace(/\s?\s?<tbody>\s*/g, "");

	//add a tbody if there is not one
	table_string = table_string.replace(/<table>\s*<tr>/g, "<table>\n<tbody>\n<tr>");

	
	table_string = table_string.replace(/<\/tr>\s*<\/table>/, "<\/tr>\n<\/tbody>\n<\/table>");

	//***********************************SUBMIT SETTINGS

	//settings		
	if ($('#setting1').is(':checked')){//em			
		table_string = table_string.replace(/<(\/?)i>/g, "<$1em>");
	} else {
		table_string = table_string.replace(/<(\/?)i>/g, "");
	}

	if ($('#setting2').is(':checked')){//strong
		table_string = table_string.replace(/<(\/?)b>/g, "<$1strong>");
	} else {
		table_string = table_string.replace(/<(\/?)b>/g, "");

		table_string = table_string.replace(/<(\/?)strong>/g, "");
	}

	if ($('#setting3').is(':checked')){//p

	} else {
		table_string = table_string.replace(/<(\/?)p>/g, "");
	}


	// if ($('#setting4').is(':checked')){//span
	// } else {
	// 	table_string = table_string.replace(/<(\/?)span>/g, "");
	// }

	table_string = table_string.replace(/<(\/?)span>/g, "");//remove spans


	if ($('#setting5').is(':checked')){//encode
		//change chars into hex codes       
		table_string = encode(table_string,1);
	}
	if ($('#setting8').is(':checked')){//nbsp
		
		table_string = table_string.replace(/<t(d|h)>\s*<\/t(d|h)>/g, "<t$1>&nbsp;<\/t$1>");//add nbsp to empty cells
		
	} else {
		table_string = table_string.replace(/&nbsp;/g, "");//remove all nbsp
	}
	table_string = table_string.replace(/&#38;/g, "&");
	//remove empty rows at the end of table
	table_string = table_string.replace(/<tr>\s*(<td>(&nbsp;|)<\/td>\s*)+<\/tr>\s*(<\/(tbody|table)>)/g, "$3");


	//generate the string in an easy to read way
	var display_string 
	display_string = "<div class = 'preview_divider'>"
	display_string += "<h3>Table "
	display_string += (n+1)
	display_string += " </h3> "
	display_string += "<span class='preview_table'>"
	display_string += table_string
	display_string += "</span>"

	

	display_string += '	<div class="settings">'

	display_string += "<br><textarea class='preview_textarea' readonly>"
	display_string += encode(table_string,0);
	display_string += "</textarea><br>"
	display_string += "<button class='select' type='button'>Select for copying</button><br>"
	display_string += '	<input type="checkbox" class="setting_caption">Add <span class="courier">caption</span>'
	display_string += '	<textarea class="caption small_input" placeholder="Caption" spellcheck="false"></textarea><br>'

	display_string += '	<input type="checkbox" class="setting_summary">Add <span class="courier">summary</span>'
	display_string += '	<textarea class="summary small_input" placeholder="Summary" spellcheck="false"></textarea><br>'

	



	display_string += '<input type="checkbox" class="setting_span">Disable <span class="courier">colspan</span> and <span class="courier">rowspan</span> Try this if table displaying strangely.<br>'
	display_string += '<input type="checkbox" class="setting_thead" name="setting_thead"><label for="setting_thead">Use <span class="courier">&#60;thead&#62;</span>'

	
	display_string += '	 and <span class="courier">&#60;th&#62;</span> for first </label><input type="text" maxlength="2" class="row_num tiny_input" value="1"> '
	display_string += '	 <span class="rowspan">row(s)</span><span class="error"> Please enter a number between 1 and 99</span>'

	display_string += '<span class="tfoot_span"><br><input type="checkbox" class="setting_tfoot">Add <span class="courier">tfoot</span>'
	display_string += '	<textarea class="tfoot small_input" placeholder="Table footer" spellcheck="false"></textarea></span>'


	display_string += class_html//displays add class input box


	display_string += '<br><button class="plus" title="Add another class">+</button>'
	display_string += ' Display multiple classes with <form><input type="radio" name="display" value="stripes" class="stripes">stripes'
	display_string += '<input type="radio" name="display" value="gradient"  checked>gradient</form>'
	



	display_string += '	<textarea type="hidden" class="hidden">'
	display_string += encode(table_string,0);

	display_string += '</textarea>'


	display_string += "<br><button class='apply_button large' type='button'>Apply settings</button><br>"

	display_string += '	</div>'

	

	
	display_string +=  "</div>" 

	$( "#preview_div").append( display_string );//send output to div 

	$(".caption").fadeOut(0);
	$(".summary").fadeOut(0)
	$(".tfoot").fadeOut(0)
	$(".tfoot_span").fadeOut(0)
	$(".error").fadeOut(0);
	$(".error2").fadeOut(0);
	$(".error4").fadeOut(0);
	$(".stripes").attr('checked',true);

			
}//******************************************************************************************************************function generate html

// $(document).on('click', 'td', function()	{//must be set up this way to apply to dynamically created buttons
// 		alert(this.cellIndex + 1)
// });
// $(document).on('click', 'tr', function()	{//must be set up this way to apply to dynamically created buttons
// 		alert(this.rowIndex + 1)
// });

//smooth scrolling
$('a[href^="#"]').on('click',function (e) {
	e.preventDefault();

	var target = this.hash,
	$target = $(target);

	$('html, body').stop().animate({
		'scrollTop': $target.offset().top
	}, 900, 'swing', function () {
		window.location.hash = target;
	});
});


function encode(table_string,options){
	var a = table_string.length;
				var tempArray = [];
				while (a--) {
					var number = table_string[a].charCodeAt();
					if (number == 38 || (number ==96) || number > 127) {
						tempArray[a] = '&#'+number+';';

					} else {
						tempArray[a] = table_string[a];
					}
				}
					//sets original string to the new encoded values
					table_string = tempArray.join('');

					if(options==1){//if true, turn nbsp back into valid html (for use inside actual table)
						table_string = table_string.replace(/&#38;nbsp;/g, "&nbsp;");
					}
					 // fix the non breaking spaces that got encoded
					if(options==2){//if 2, encode less than and more than
						 table_string = table_string.replace(/</g, "&#60;");
					table_string = table_string.replace(/>/g, "&#62;");
					}
					
	return table_string;


}
function expand_Colspan(this_table_string){
			colspan_array = this_table_string.match(/<t(d|h)[\S ]*? colspan="\d\d?"[\S ]*?>[\S\s]*?<\/t(d|h)>/g)//save all the colspans

		if (colspan_array != null){//if colspans have been found
			for (i = 0; i < colspan_array.length; i++){//cycle through them all
				

				this_table_string = this_table_string.replace(/ colspan/, " "+ i +"colspan")//add a unique number to this colspan to stop duplicates causing problems
				colspan_array[i] = colspan_array[i].replace(/ colspan/, " "+ i +"colspan")
				
				
				num = colspan_array[i].match(/colspan="\d\d?"/)
				num = num[0].match(/\d\d?/)//extract their number	
	
				var this_rowspan = colspan_array[i].match(/rowspan="\d\d?"/)
				
				if (this_rowspan == null){
					this_rowspan = 0;
				}
				else{
					this_rowspan = this_rowspan[0].match(/\d\d?/)//extract their number	
				}
								
				var the_string = Array(parseInt(num)).join('\n<td rowspan="'+ this_rowspan +'" empty></td>')//create the correct number of empty tds ADD ON THE ROW SPAN
				
				the_string = colspan_array[i] + the_string // add these onto the end of the string

				
				var regex = new RegExp('<t(d|h) ' + i + 'colspan="\\d\\d?".*>[\S\s]*?<\/t(d|h)>',"g")

				this_table_string = this_table_string.replace(regex,the_string)//put it back into the table, using the colspan id to ensure the wrong one isnt replaced

			}
		}
		this_table_string = this_table_string.replace(/\d\d?\d?\d?colspan/g,"colspan")
	return this_table_string;
				
}

function add_Cell(this_table_string,row,column){
	// regex = new RegExp('((<tr>(\\s|.)*?<\/tr>\\s*?){1}<tr>(\\s*<td.*<\/td>){1})')
	regex = new RegExp('((<tr>(\\s|.)*?<\/tr>\\s*?){'+ (column ) + '}<tr>(\\s*<td.*<\/td>){'+ (row - 1) + '})')
	this_table_string = this_table_string.replace(regex,"$1\n<td empty></td>");
	return this_table_string;
}

function remove_Duplicates(list_array){//removes duplicates from an array
	unique_array=[];
	$.each(list_array, function(i, element){
    	if($.inArray(element, unique_array) === -1) unique_array.push(element);
	});
    return unique_array;
}