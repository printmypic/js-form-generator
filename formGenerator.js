
function showModal(modalContent,callback) {
	for (i in modalContent) {
		if (i === 'modalcancel' || i === 'modalsave') {
			$('#' + i).attr('onclick', modalContent[i]);
			if (modalContent[i] === '') {
				$('#' + i).text('close').hide();
			} else {
				$('#' + i).text('save').show();
			}
		} else if ($.isFunction(modalContent[i])) {
			$('#' + i).html(modalContent[i]());
		} else {
			$('#' + i).html(modalContent[i]);
		}
	}
	$('#myModal').modal();
	if($.isFunction(callback)){
		callback();
	}
}

var formGenerator = {
	tableSelector: '#data',
	tableHeaders: '#data th',
	formId: 'newUserForm',
	form: {},
	skipVars: ['id'],
	init: function (config, callback) {
		if (config.formId) {
			this.formId = config.formId;
		}

		if (config.tableHeaders) {
			this.tableHeaders = config.tableHeaders;
		}

		if (config.editElement) {
			this.form = this.setValuesByTableRow(config.editElement, config.form);
		} else {
			this.form = config.form;
		}

		if($('#'+this.formId).size()){
			$('#'+this.formId).remove();
		}

		var $form = $('<form id="'+this.formId+'" autocomplete="off" class="form-horizontal"></form>');
		var that = this;

		$(this.tableHeaders).each(function () {
			var name = $(this).text().toLowerCase().replace(/ /g, '_');
			if ($.inArray(name, that.skipVars) !== -1 || typeof (that.form[name]) === 'undefined') {
				return;
			}
			$formElement = that.createFormElement(that.form[name].name, that.form[name].type, that.form[name].value);
			$formElement.appendTo($form);
		});

		if(callback && $.isFunction(callback)){
			setTimeout(function () {
				callback()
			}, '200');
		}
		return this.htmlForm = $form[0].outerHTML;

	},
	createFormElement: function (name, type, value) {
		var $inputContainer = $('<div class="form-group col-md-6"></div>');
		var $container = $('<div class="form-group col-md-12"></div>');
		switch (type) {
			case 'password':
			case 'text':
			case 'email':
			case 'hidden':
			case 'number':
			value = value ? value : '';
			$element = $('<input autocomplete="off" type="' + type + '" class="form-control" id="' + name + '" placeholder="' + name.replace(/_/g, ' ') + '" name="' + name + '" value="' + value + '" />');
			break;
			case 'select':
			var options = this.getOptions(this.form[name].selectData,value);
			$element = $('<select class="form-control" id="' + name + '" placeholder="' + name + '" name="' + name + '">' + options + '</select>');
			break;
		}
		$inputContainer.append($element);
		$labelContainer = $('<div class="form-group col-md-6"><label for="' + name + '">' + name.replace(/_/g, ' ') + '</label></div>');
		$container.append($labelContainer);
		return $container.append($inputContainer);
	},
	getColByThTr: function (thText, $element, tableSelector) {
		var landingIndex = $(tableSelector + ' th:contains(' + thText + ')').index() + 1;
		return $element.closest('tr').find('td:nth-child(' + landingIndex + ')');
	},
	setValuesByTableRow: function ($element, form) {
		var editForm = form;
		for (i in editForm) {
			var th = i.replace(/_/g, ' ');
			if (editForm[i].type === 'select') {
				editForm[i].selectData.selected = this.getColByThTr(th, $element, this.tableSelector).text();
			} else if (editForm[i].type === 'password') {
				editForm[i].value = '';
			} else {
				editForm[i].value = this.getColByThTr(th, $element, this.tableSelector).text().trim();
			}
		}
		return editForm;
	},
	formatSelectArr: function (arr, nasted, selectedItem) {
		var formattedSelectArr = [];
		if (!selectedItem) {
			formattedSelectArr.push({'title': 'Select', 'selected': true, 'value': ''});
		}
		var value, title = '';
		for (i in arr) {
			title = arr[i];
			if (nasted) {
				value = i;
			} else {
				value = arr[i];
			}
			if (selectedItem === arr[i]) {
				selected = true;
			} else {
				selected = false;
			}
			formattedSelectArr.push({'title': title, 'selected': selected, 'value': value});
		}
		return formattedSelectArr;
	},
	getOptions: function (arr) {
		var data = this.formatSelectArr(arr.data, arr.nasted, arr.selected);
		var html = '';
		for (i in data) {
			selected = (data[i].selected) ? 'selected' : '';
			html += '<option value="' + data[i].value + '" ' + selected + '>' + data[i].title + '</option>';
		}
		return html;
	}

};



var userTypes = {"1":"Admin","2":"API"};
var bids = ["bid1","bid2"];
var countriesArr = ["Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","British Indian Ocean Territory","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo","Congo, the Democratic Republic of the","Cook Islands","Costa Rica","Cote DIvoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands (Malvinas)","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and Mcdonald Islands","Holy See (Vatican City State)","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran, Islamic Republic of","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea, Democratic Peoples Republic of","Korea, Republic of","Kuwait","Kyrgyzstan","Lao Peoples Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Lithuania","Luxembourg","Macao","Macedonia, the Former Yugoslav Republic ","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia, Federated States of","Moldova, Republic of","Monaco","Mongolia","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestinian Territory","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the South Sandwich Isl","Spain","Sri Lanka","Sudan","Suriname","Svalbard and Jan Mayen","Swaziland","Sweden","Switzerland","Syrian Arab Republic","Taiwan, Province of China","Tajikistan","Tanzania, United Republic of","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu","Venezuela","Viet Nam","Virgin Islands, British","Virgin Islands, U.s.","Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe","Montenegro"];
var userForm = {
	'full_name': {type: 'text', name: 'full_name',value:''},
	'user': {type: 'text', name: 'user',value:''},
	'password': {type: 'password', name: 'password',value:''},
	'bid': {type: 'select', name: 'bid', selectData: {'data':bids, 'nasted':false, 'selected':''},value:''},
	'pids': {type: 'text', name: 'pids',value:''},
	'phone': {type: 'number', name: 'phone',value:''},
	'type': {type: 'select', name: 'type', selectData: {'data':userTypes, 'nasted':true, 'selected':'Affiliate'},value:''},
	'country': {type: 'select', name: 'country', selectData:  {'data':countriesArr, 'nasted':false, 'selected':'Israel'},value:''},
	'email': {type: 'email', name: 'email',value:''},
};


function editUser(element, id) {
	var formObj = $.extend(true, {}, userForm);
    showModal({
		'modalsave': '',
		'modalcancel': '',
		'modaltitle': 'Info',
		'modalbody': '' + formGenerator.init(
		{
			'tableHeaders': '#data th',
			'form': formObj,
			'editElement':$(element)
		}
		) + ''
	});
}

function newUserForm(){
	var formObj = $.extend(true, {}, userForm);
	showModal({
		'modalsave': 'alert(\'save\')',
		'modalcancel': '',
		'modaltitle': 'Info',
		'modalbody': '' + formGenerator.init(
		{
			'tableHeaders': '#data th',
			'form': formObj,
			'editElement':false
		}
		) + ''
	});
}

$(function(){
	newUserForm();
});


