function toggleMenu() {
	$('.menu').toggleClass('active');
}

function createSelect(title) {
	html = '<div class="btn-group select-x showOneCell showTwoCells"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' + title + ' <span class="caret"></span></button><ul class="dropdown-menu" role="menu"></ul></div>';
	
	return html;
}

function addOptionOld(title, value, optionClass) {
	return '<option class="' + optionClass + '" value="' + value + '">' + title + '</option>';
}

function addOption(title, optionClass, functionCallback) {
	return '<li class="' + optionClass + '"><a href="#" onclick="' + functionCallback + '">' + title + '</a></li>';
}

function updateMonster(element, value) {
	updateOption(element, value, true);
}

function updateCoordinate(element, value) {
	updateOption(element, value, false);
}

function updateOption(element, value, isMonster) {
	var container = $(element).parents('.select-row');
	if (isMonster || value == 'Clear') { //monster select or clearing cordinates
		monsterTitle = $(element).html();
		container.find('input[name="master"]').attr('value', monsterTitle.indexOf('master') > -1);
		var xYSelects = $(container).find('.select-x, .select-y');
		
		if (isMonster) {
			var monsterHp;
			if (monsterTitle.indexOf('master') > -1) {
				if (actOne) {
					monsterHp = MONSTERS[value].masterHpActOne;
				} else {
					monsterHp = MONSTERS[value].masterHpActTwo;
				}
			} else {
				if (actOne) {
					monsterHp = MONSTERS[value].minionHpActOne;
				} else {
					monsterHp = MONSTERS[value].minionHpActTwo;
				}
			}
			container.find('.monster-title').html(monsterTitle + ' ');
			container.find('input[name="monster-title"]').attr('value',value);
			container.find('.x-title').html('Select X coordinate' + ' ');
			container.find('.y-title').html('Select Y coordinate' + ' ');
			container.find('input[name="monster-x"]').attr('value','');
			container.find('input[name="monster-y"]').attr('value','');
			container.find('input[name="monster-hp"]').val(monsterHp);
		} else {
			var otherElementThanCleared;
			if ($(element).parents('.btn-group').hasClass('select-x')) {
				otherElementThanCleared = container.find('.select-y');
				container.find('.x-title').html('Select X coordinate' + ' ');
				container.find('input[name="monster-x"]').attr('value','');
			} else {
				otherElementThanCleared = container.find('.select-x');
				container.find('.y-title').html('Select Y coordinate' + ' ');
				container.find('input[name="monster-y"]').attr('value','');
			}
			xYSelects = otherElementThanCleared;
			value = container.find('.monster-title').html();
			value = value.substring(0, value.length - 1);
		}
		
		var firstClass = SHOWING_CLASSES[MONSTERS[value].width];
		var secondClass = SHOWING_CLASSES[MONSTERS[value].height];
		xYSelects.removeClass(SHOWING_CLASSES[1] + ' ' + SHOWING_CLASSES[2] + ' ' + SHOWING_CLASSES[3] + ' squared');
		xYSelects.addClass(firstClass);
		if (firstClass == secondClass) {
			xYSelects.addClass('squared');
		} else {
			xYSelects.addClass(secondClass);
		}
	} else { //coordinate select
		var selectedSize = value.charAt(0);
		var selectedCooedinate = value.substr(1);
		var parent = $(element).parents('.btn-group');
		
		if (parent.hasClass('select-x')) {
			container.find('input[name="monster-x"]').attr('value',selectedCooedinate);
			container.find('input[name="hero-x"]').attr('value',selectedCooedinate);
			container.find('input[name="monster-x-size"]').attr('value',selectedSize);
			container.find('.x-title').html($(element).html() + ' ');
			if (!parent.hasClass('squared')) {
				container.find('.select-y').removeClass(SHOWING_CLASSES[selectedSize]);
			}
		} else {
			container.find('.y-title').html($(element).html() + ' ');
			container.find('input[name="monster-y"]').attr('value',selectedCooedinate);
			container.find('input[name="hero-y"]').attr('value',selectedCooedinate);
			container.find('input[name="monster-y-size"]').attr('value',selectedSize);
			if (!parent.hasClass('squared')) {
				container.find('.select-x').removeClass(SHOWING_CLASSES[selectedSize]);
			}
		}
	}
}

function updateHero(element, value) {
	var container = $(element).parents('.select-row');

	container.find('.hero-title').html(value + ' ');
	container.find('input[name="hero-title"]').attr('value',value);
	container.find('input[name="hero-x"]').attr('value','');
	container.find('input[name="hero-y"]').attr('value','');
	container.find('input[name="hero-hp"]').val(HEROES[value].hp);
	container.find('input[name="hero-stamina"]').val(HEROES[value].stamina);
	container.children('img').attr('src', 'images/heroes_cards/' + value.replace(new RegExp(" ",'g'), '_') + '.jpg');
	var heroId = container.parent().attr('id');
	$('[href="#' + heroId + '"]').html(value);
	updateArchetype(element, HEROES[value].archetype.title);
}

function adjustHero(element, archetype) {
	var container = $(element).parents('.select-row');
	var heroTitle = container.find('input[name="hero-title"]').val();
	if (heroTitle != '' && HEROES[heroTitle].archetype.title != archetype) {
		clearHero(element);
	}
}

function clearHero(element) {
	var container = $(element).parents('.select-row');
	container.find('.hero-title').html('Select hero ');
	container.find('input[name="hero-title"]').attr('value','');
	container.find('img').attr('src', 'images/heroes_cards/default.jpg');
}

function updateArchetype(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.archetype-title').html(value + ' ');
	container.find('input[name="archetype-title"]').attr('value',value);
	adjustClass(element, value);
	adjustHero(element, value);
}

function adjustArchetype(element, archetype) {
	var container = $(element).parents('.select-row');
	container.find('.select-archetype ul').removeClass(ARCHETYPE_CLASSES).addClass(archetype.toLowerCase());
}

function clearArchetype(element) {
	var container = $(element).parents('.select-row');
	container.find('.select-archetype ul').addClass(ARCHETYPE_CLASSES.toLowerCase());
	container.find('.archetype-title').html('Select archetype ');
	container.find('input[name="archetype-title"]').attr('value','');
	adjustClass(element, ARCHETYPE_CLASSES);
}

function updateClass(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.class-title').html(value + ' ');
	container.find('input[name="class-title"]').attr('value',value);
	adjustArchetype(element, CLASSES[value].archetype.title);
	adjustSkills(element, value);
}

function adjustClass(element, archetype) {
	var container = $(element).parents('.select-row');
	container.find('.select-class ul').removeClass(ARCHETYPE_CLASSES).addClass(archetype.toLowerCase());
	var currentClass = container.find('input[name="class-title"]').val();
	if (currentClass != '' && CLASSES[currentClass].archetype.title != archetype) {
		clearClass(element);
	}
}

function clearClass(element) {
	var container = $(element).parents('.select-row');
	container.find('.class-title').html('Select class ');
	container.find('input[name="class-title"]').attr('value','');
}

function updateSkills(element, skillValues) {
	var container = $(element).parents('.select-row');
	for (var i = 0; i < skillValues.length; i++) {
		container.find('input[name="' + skillValues[i][0] + '"]').prop('checked', skillValues[i][1]);
	}
}

function adjustSkills(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.skills-container').attr("class", "showclass skills-container " + value.replace(new RegExp(" ",'g'), '').toLowerCase());
}

function adjustSkillsImages(element) {
	var container = $(element).parents('.select-row');
	var checkedSkills = [];
	var className = container.find('input[name="class-title"]').attr('value');
	var skills = $(container).find('.checkbox.' + className.replace(new RegExp(" ",'g'), '').toLowerCase() + ' input');
	for (var i = 0; i < skills.length; i++) {
		var currentSkill = $(skills[i]);
		if (currentSkill.prop('checked')) {
			checkedSkills.push(currentSkill.attr('name'));
		}
	}
	container.find('.imagescontainer img').removeClass('showimage');
	for (var i = 0; i < checkedSkills.length; i++) {
		container.find('[skill="' + checkedSkills[i] + '"]').addClass('showimage');
	}
}

function removeRow(element) {
	$(element).parents('.select-row').remove();
}

function removeMonsterRows() {
	$('#monsters-container .select-row').remove();
}

function getAlphabetChar(number) {
	result = '';
	if (number > 26) {
		result += ALPHABET.charAt(Math.floor(number/26) - 1);
	}
	return result += ALPHABET.charAt(number%26);
}

function createYSelectContent (oneCellOnly) {
	var html = addOption('Clear', '', 'updateCoordinate(this, \'Clear\');');
	for (var i = 1; i <= mapWidth; i++) {
		html += addOption(i.toString(), 'oneCell', 'updateCoordinate(this, \'1' + i.toString() + '\');');
		if (i <= mapWidth-1 && !oneCellOnly)
			html += addOption(i.toString() + '-' + (i+1).toString(), 'twoCells', 'updateCoordinate(this, \'2' + i.toString() + '\');');
		if (i <= mapWidth-2 && !oneCellOnly)
			html += addOption(i.toString() + '-' + (i+2).toString(), 'threeCells', 'updateCoordinate(this, \'3' + i.toString() + '\');');
	}
	return html;
}

function createXSelectContent (oneCellOnly) {
	var html = addOption('Clear', '', 'updateCoordinate(this, \'Clear\');');
	for (var i = 1; i <= mapHeight; i++) {
		html += addOption(getAlphabetChar(i-1), 'oneCell', 'updateCoordinate(this, \'1' + i.toString() + '\');');
		if (i <= mapHeight-1 && !oneCellOnly)
			html += addOption(getAlphabetChar(i-1) + '-' + getAlphabetChar(i), 'twoCells', 'updateCoordinate(this, \'2' + i.toString() + '\');');
		if (i <= mapHeight-2 && !oneCellOnly)
			html += addOption(getAlphabetChar(i-1) + '-' + getAlphabetChar(i+1), 'threeCells', 'updateCoordinate(this, \'3' + i.toString() + '\');');
	}
	return html;
}

function createMonsterSelectContent () {
	var html = '';
	for (var i = 0; i < MONSTERS_LIST.length; i++) {
		html += addOption(MONSTERS_LIST[i][0] + ' master', '', 'updateMonster(this, \'' + MONSTERS_LIST[i][0] + '\');');
		html += addOption(MONSTERS_LIST[i][0] + ' minion', '', 'updateMonster(this, \'' + MONSTERS_LIST[i][0] + '\');');
	}
	return html;
}

function createHeroSelectContent () {
	var html = addOption('Clear', '', 'clearHero(this);');
	for (var i = 0; i < HEROES_LIST.length; i++) {
		html += addOption(HEROES_LIST[i][0] + ' ', '', 'updateHero(this, \'' + HEROES_LIST[i][0] + '\');');
	}
	return html;
}

function createClassSelectContent () {
	var html = addOption('Clear', '', 'clearClass(this);');
	for (var i = 0; i < ARCHETYPES_LIST.length; i++) {
		for (var j = 0; j < ARCHETYPES_LIST[i].classes.length; j++) {
			var title = ARCHETYPES_LIST[i].classes[j].title;
			html += addOption(title + ' ', ARCHETYPES_LIST[i].title, 'updateClass(this, \'' + title + '\');');
		}
	}
	return html;
}

function createArchetypeSelectContent () {
	var html = addOption('Clear', '', 'clearArchetype(this);');
	for (var i = 0; i < ARCHETYPES_LIST.length; i++) {
		var title = ARCHETYPES_LIST[i].title;
		html += addOption(title + ' ', title, 'updateArchetype(this, \'' + title + '\');');
	}
	return html;
}

function addUnitLine(line, title) {
	line.addClass('select-row');
	line.append(createInputSelect('Select ' + title, title + '-title', 'select-' + title));
	line.append(createInputSelect('Select X coordinate', 'x-title', 'select-x'));
	line.append(createInputSelect('Select Y coordinate', 'y-title', 'select-y'));
	line.append($('<input type="text" name="' + title + '-hp" class="form-control" placeholder="Set HP" value=""/>'));
	line.append($('<input type="hidden" name="' + title + '-title" value=""/>'));
	line.append($('<input type="hidden" name="' + title + '-x" value=""/>'));
	line.append($('<input type="hidden" name="' + title + '-y" value=""/>'));
}

function addMonsterLine() {
	var monsterLine = $('<div>').attr('id','monster' + monsterNumber.toString());
	monsterNumber += 1;
	addUnitLine(monsterLine, 'monster');
	monsterLine.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove row</button>'));
	monsterLine.append($('<input type="hidden" name="master" value=""/>'));
	monsterLine.append($('<input type="hidden" name="monster-y-size" value=""/>'));
	monsterLine.append($('<input type="hidden" name="monster-x-size" value=""/>'));
	
	monsterLine.find('.select-monster ul').append(createMonsterSelectContent());
	monsterLine.find('.select-x ul').append(createXSelectContent(false));
	monsterLine.find('.select-y ul').append(createYSelectContent(false));
	$('#monsters-container').append(monsterLine);
	return monsterLine;
}

function addHeroLine(number) {
	var heroLine = $('<div>').attr('id','hero' + number.toString() + 'wrapper');
	addUnitLine(heroLine, 'hero');
	heroLine.append($('<input type="text" name="hero-stamina" class="form-control" placeholder="Set stamina" value=""/>'));
	
	heroLine.find('.select-hero ul').append(createHeroSelectContent());
	heroLine.find('.select-x ul').append(createXSelectContent(true));
	heroLine.find('.select-x ul').addClass('showOneCell');
	heroLine.find('.select-y ul').addClass('showOneCell').append(createYSelectContent(true));
	heroLine.append(createInputSelect('Select Archetype ', 'archetype-title', 'select-archetype'));
	heroLine.find('.select-archetype ul').addClass(ARCHETYPE_CLASSES + ' showarch').append(createArchetypeSelectContent());
	heroLine.append($('<input type="hidden" name="archetype-title" value=""/>'));
	heroLine.append(createInputSelect('Select Class ', 'class-title', 'select-class'));
	heroLine.find('.select-class ul').addClass(ARCHETYPE_CLASSES + ' showarch').append(createClassSelectContent());
	heroLine.append($('<input type="hidden" name="class-title" value=""/>'));
	heroLine.append(createSkillsBlock());
	heroLine.append($('<img>').attr('src', ''));
	$('#hero' + number.toString()).append(heroLine);
}

function createSkillsBlock() {
	var html = $('<div>').addClass('showClass').addClass('skills-container');
	html.append($('<h1>Skills</h1>'));
	var skillsImages = $('<div>').addClass('imagescontainer');
	for (c in CLASSES) {
		if (CLASSES[c] == undefined) continue;
		var currentClass = CLASSES[c];
		for (var i = 0; i < currentClass.skills.length; i++) {
			var skill = currentClass.skills[i];
			if (skill[2] != undefined) continue;
			var classUpdatedTitle = currentClass.title.replace(new RegExp(" ",'g'), '').toLowerCase();
			var skillObject = $('<div>').addClass('checkbox').addClass(classUpdatedTitle);
			skillObject.append($('<label><input type="checkbox" name="' + skill[0] + '" onClick="adjustSkillsImages(this);"/> ' + skill[0] + '</label>'));
			if (skill[1] == 0) {
				skillObject.addClass('disabled');
				skillObject.find('input').prop('checked', true);
				skillObject.find('input').attr('disabled', '');
			}
			html.append(skillObject);
			skillsImages.append($('<img>').attr('src', 'images/classes_cards/' + classUpdatedTitle + '/' + skill[0].replace(new RegExp(" ",'g'), '_').toLowerCase() + '.jpg').attr('skill', skill[0]));
		}
	}
	return html.append(skillsImages);
}

function createInputSelect(title, titleClass, additionalClass) {
	var select = $('<div>').addClass('btn-group').addClass(additionalClass);
	var button = $('<button>').attr('type','button').addClass('btn btn-default dropdown-toggle').attr('data-toggle','dropdown').attr('aria-expanded','false');
	button.append($('<span>' + title + ' </span>').addClass(titleClass)).append($('<span>').addClass('caret'));
	select.append(button).append($('<ul>').addClass('dropdown-menu').attr('role','menu'));
	return select;
}

function monster(element) {
	var container = $(element);
	var monster = {};
	monster.title = container.find('[name="monster-title"]').val();
	monster.master = container.find('[name="master"]').val();
	monster.x = container.find('[name="monster-x"]').val();
	monster.y = container.find('[name="monster-y"]').val();
	monster.vertical = container.find('[name="monster-x-size"]').val() < container.find('[name="monster-y-size"]').val();
	monster.hp = container.find('[name="monster-hp"]').val();
	monster.stamina = container.find('[name="monster-stamina"]').val();
	return monster;
}

function hero(element) {
	var container = $(element);
	var hero = {};
	hero.title = container.find('[name="hero-title"]').val();
	hero.x = container.find('[name="hero-x"]').val();
	hero.y = container.find('[name="hero-y"]').val();
	hero.hp = container.find('[name="hero-hp"]').val();
	hero.stamina = container.find('[name="hero-stamina"]').val();
	hero.className = container.find('[name="class-title"]').val();
	hero.skills = getSkills(container, hero.className);
	return hero;
}

function getSkills(container, className) {
	var result = [];
	var skills = $(container).find('.checkbox.' + className.replace(new RegExp(" ",'g'), '').toLowerCase() + ' input');
	for (var i = 0; i < skills.length; i++) {
		var currentSkill = $(skills[i]); 
		result.push([currentSkill.attr('name'), currentSkill.prop('checked')]);
	}
	return result;
}

function populate() {
	collectData();
	updateConfig();
	constructMapFromConfig();
}

function constructMapFromConfig() {
	/*under construction*/;
}

function constructSettingsFromConfig() {
	for (var i=1; i <= 4; i++) {
		var j = i.toString();
		if (config['hero' + j].title != "") {
			updateHero($('#hero' + j + ' .select-hero li')[0],config['hero' + j].title);
			$('#hero' + j + ' [name="hero-hp"]').val(config['hero' + j].hp);
			$('#hero' + j + ' [name="hero-stamina"]').val(config['hero' + j].stamina);
			$('#hero' + j + ' [name="hero-x"]').val(config['hero' + j].x);
			$('#hero' + j + ' .x-title').html(getAlphabetChar(config['hero' + j].x - 1) + ' ');
			$('#hero' + j + ' [name="hero-y"]').val(config['hero' + j].y);
			$('#hero' + j + ' .y-title').html(config['hero' + j].y.toString() + ' ');
			if (config['hero' + j].className != undefined) {
				updateClass($('#hero' + j + ' .select-class li')[0], config['hero' + j].className.toString());
			}
			if (config['hero' + j].skills != undefined) {
				updateSkills($('#hero' + j + ' .skills-container'), config['hero' + j].skills);
				adjustSkillsImages($('#hero' + j + ' .skills-container'));
			}
		}
	}
	removeMonsterRows();
	for (var i = 0; i < config.monsters.length; i++) {
		var monster = config.monsters[i];
		if (monster.title != '') {
			var monsterLine = addMonsterLine();
			var width = monster.vertical ? MONSTERS[monster.title].width : MONSTERS[monster.title].height;
			var height = monster.vertical ? MONSTERS[monster.title].height : MONSTERS[monster.title].width;
			
			var monsterSelectUnit = monsterLine.find('[onclick="updateMonster(this, \'' + monster.title + '\');"]');
			var correctMonsterSelectUnit;
			
			if (monster.master && $(monsterSelectUnit[0]).html().indexOf('master') > -1 || !monster.master && !($(monsterSelectUnit[0]).html().indexOf('master') > -1)) {
				correctMonsterSelectUnit = monsterSelectUnit[0];
			} else {
				correctMonsterSelectUnit = monsterSelectUnit[1];
			}
			updateMonster(correctMonsterSelectUnit, monster.title);
			
			var xValue = width.toString() + monster.x.toString();
			updateCoordinate(monsterLine.find('.select-x [onclick="updateCoordinate(this, \'' + xValue + '\');"]'), xValue);
			var yValue = height.toString() + monster.y.toString();
			updateCoordinate(monsterLine.find('.select-y [onclick="updateCoordinate(this, \'' + yValue + '\');"]'), yValue);
			monsterLine.find('input[name="monster-hp"]').val(monster.hp);
		}
	}
	/*under construction*/;
}

function updateConfig() {
	window.location.hash = Base64.encode(JSON.stringify(config));
}

function decodeConfig() {
	config = JSON.parse(Base64.decode(window.location.hash));
}

function collectData() {
	var monsterRows = $('#monsters .select-row');
	config.monsters = [];
	for (var i = 0; i < monsterRows.length; i++) {
		config.monsters.push(monster(monsterRows[i]));
	}
	config.hero1 = hero($('#hero1 .select-row'));
	config.hero2 = hero($('#hero2 .select-row'));
	config.hero3 = hero($('#hero3 .select-row'));
	config.hero4 = hero($('#hero4 .select-row'));
}

function adjustAct() {
	actOne = $('[name="act"]:checked').val() == 'one';
}

$(function() {
	addMonsterLine();
	for (var i = 1; i <= 4; i++) {
		addHeroLine(i);
	}
	if (window.location.hash != "") {
		decodeConfig();
		constructMapFromConfig();
		constructSettingsFromConfig();
	} else {
		//TEST
		config = JSON.parse(Base64.decode(defaultConfig));
		constructMapFromConfig();
		constructSettingsFromConfig();
	}

	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
});