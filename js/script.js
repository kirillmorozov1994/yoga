window.addEventListener('DOMContentLoaded', function () {
	
	'use strict';
	//Информационные табы ==============================================
	let tab = document.querySelectorAll('.info-header-tab'),
			info = document.querySelector('.info-header'),
			tabContent = document.querySelectorAll('.info-tabcontent');
	
	let hideTabContent = (a) => {
		for(let i = a; i < tabContent.length; i++) {
			tabContent[i].classList.remove('show');
			tabContent[i].classList.add('hide');
		}
	}


	hideTabContent(1);

	let showTabContent = (b) => {
		if(tabContent[b].classList.contains('hide')) {
			tabContent[b].classList.remove('hide');
			tabContent[b].classList.add('show');
		}
	}

	info.addEventListener('click', (event) => {
		let target = event.target;
		if(target && target.classList.contains('info-header-tab')) {
			for(let i = 0; i < tab.length; i++) {
				if(target == tab[i]) {
					hideTabContent(0);
					showTabContent(i);
					break;
				}
			}
		}
	});
	//Информационные табы ==============================================

	//Таймер ===========================================================
	let deadLine = '2018-12-10';

	let getTimerRemaining = (endtime) => {
		let t = Date.parse(endtime) - Date.parse(new Date()),
				seconds = Math.floor((t/1000) % 60),
				minutes = Math.floor((t/1000/60) % 60),
				hours = Math.floor((t/(1000*60*60)));

				return {
					'total' : t,
					'hours' : hours,
					'minutes' : minutes,
					'seconds' : seconds
				};
	}
	
	let setClock = (id, endtime) => {
		let timer = document.getElementById(id),
				hours = timer.querySelector('.hours'),
				minutes = timer.querySelector('.minutes'),
				seconds = timer.querySelector('.seconds');
				let timeInterval = setInterval(upDateClock, 1000);

				function upDateClock(a = '0', b = '00') {
					let t = getTimerRemaining(endtime);
						if (t.hours < 10) {
							t.hours = `0${t.hours}`;
						}
						if (t.minutes < 10) {
							t.minutes= `0${t.minutes}`;
						}
						if (t.seconds < 10) {
							t.seconds = `0${t.seconds}`;
						}
							hours.textContent = t.hours;
							minutes.textContent = t.minutes;
							seconds.textContent = t.seconds;

							if(t.total <= 0) {
								clearInterval(timeInterval);
								hours.textContent = "00";
								minutes.textContent = "00";
								seconds.textContent = "00";
							}
				}
	}

	setClock('timer', deadLine);
//Таймер ===========================================================

//Плавный скролл ===================================================
	var linkMenu = document.querySelector('header'),
		V = 0.75;
	linkMenu.addEventListener('click', function (e) {
		if (e.target && e.target.tagName == "A") {
			e.preventDefault();
			let w = window.pageYOffset,
				hash = e.target.href.replace(/[^#]*(.*)/, '$1'),
				t = document.querySelector(hash).getBoundingClientRect().top - 60,
				start = null;
			requestAnimationFrame(step);

			function step(time) {
				if (start === null) start = time;
				let progress = time - start;
				let r = (t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t));
				window.scrollTo(0, r);
				if (r != w + t) {
					requestAnimationFrame(step);
				}
			}
		}
	}, false);
//Плавный скролл ===================================================

//Модальное окно ==================================================
	let more = document.querySelector('.more'),
			overlay = document.querySelector('.overlay'),
			close = document.querySelector('.popup-close');

	//Открытие модального окна
	more.addEventListener('click', function () {
		showPopup(this);
	});

	//Закрытие модального окна		
	close.addEventListener('click', function () {
		overlay.style.display = 'none';
		more.classList.remove('more-splash');
		document.body.style.overflow = '';
		statusMessage.innerHTML = "";
		clearInput();
	});

	let infoBlock = document.querySelector('.info');

	//Событие click на кнопку
	infoBlock.addEventListener('click', function (event) {
			if (event.target && event.target.classList.contains('description-btn')) {
				showPopup(event.target);
			}
	});

	//Функция открытия модального окна
	let showPopup = (t) => {
		overlay.style.display = 'block';
		t.classList.add('more-splash');
		document.body.style.overflow = 'hidden';
	}
//Модальное окно ==================================================

//Отправка формы через модальное окно ==============================

	//Создание объекта валидации и ответа сервера ===================
	let message = {
		loadind: "img/loading.gif",
		success: "img/success.png",
		failure: "img/error.png",
		validate: "img/validate.png",
		novalidate: "img/novalidate.png"
	};

	//Создание переменных с формой и инпутами
	let form = document.querySelector('.main-form'),
			input = form.getElementsByTagName('input'),
			statusMessage = document.createElement('div');

	//Контейнер валидации формы и ответа сервeра
		statusMessage.classList.add('status');
		form.appendChild(statusMessage);

	// Валидация формы + маска телефона ===========================
		function validateInput() {
			if (event.target.value.lastIndexOf('_') != -1) {
				statusMessage.innerHTML = `<img src="${message.novalidate}" />`;
			} else {
				statusMessage.innerHTML = `<img src="${message.validate}" />`;
			}
		}
		//Событие input на поле ввода номера телефона
		form.addEventListener('input', function (event) {
			if(event.target.tagName == 'INPUT') {
					maskInput(event.target);
					validateInput();
			}
		});

			//Функция маски номера телефона
			function maskInput(a) {
				let matrix = a.defaultValue,
						i = 0,
						def = matrix.replace(/\D/g, ""),
						val = a.value.replace(/\D/g, "");
				if (def.length >= val.length) {
					val = def;
				}
				matrix = matrix.replace(/[_\d]/g, function (a) {
					if (val.charAt(i) == "") {
						return "_";
					}
					return val.charAt(i++);
				});
				a.value = matrix;
				if (i == 11) {
					i = 15;
				} else {
					i = matrix.lastIndexOf(val.substr(-1));
				}
				if (i < matrix.length && matrix != a.defaultValue) {
					i++;
				} else {
					i = matrix.indexOf("_");
				}
				setCursorPosition(i, a);
			}
			//Функция определения позиции курсора в поле ввода
			function setCursorPosition(pos, elem) {
				if (pos == 15) {
					return false;
				} else {
					elem.focus();
					if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
					else if (elem.createTextRange) {
						let range = elem.createTextRange();
						range.collapse(true);
						range.moveEnd("character", pos);
						range.moveStart("character", pos);
						range.select();
					}
				}
			}
	// Валидация формы + маска телефона ===========================

	//Отправка данных на сервер ===================================
			form.addEventListener('submit', function (event) {
				event.preventDefault();

				if (event.target.children[2].value.lastIndexOf('_') != -1) {
					statusMessage.innerHTML = `<img src="${message.novalidate}" />`;
					return false;
				} else {
					statusMessage.innerHTML = `<img src="${message.validate}" />`;
				}

				let request = new XMLHttpRequest();
				request.open('POST', 'server.php');
				request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

				let formData = new FormData(form);

				function postData(formData) {
					return new Promise(function (resolve, reject) {
						let obj = {};
						formData.forEach(function (value, key) {
							obj[key] = value;
						});
						let json = JSON.stringify(obj);

						request.send(json);

						request.addEventListener('readystatechange', function () {
							if (request.readyState < 4) {
								resolve();
							} else if (request.readyState === 4 && request.status == 200) {
								resolve();
							} else {
								reject();
							}
						});
					});
				}

				postData(formData).then(() => statusMessage.innerHTML = `<img src="${message.loadind}" />`)
													.then(() => statusMessage.innerHTML = "")
													.catch(() => statusMessage.innerHTML = `<img src="${message.failure}" />`).then(clearInput).then(clearInputFoot);

			});
	//Отправка данных на сервер ===================================

	//Очистка полей инпута при закрытии формы и её отправки
	function clearInput() {
		for (let i = 0; i < input.length; i++) {
			input[i].value = "";
		}
	}
	clearInput();
//Отправка формы через модальное окно ==============================

//Отправка формы (footer) ==========================================

	//Создаем переменные с формой и инпутами
	let formFoot = document.querySelector('#form'),
			inputFoot = formFoot.getElementsByTagName('input'),
			statusMessageFoot = document.createElement('div'),
			btnFoot = formFoot.children[2];

	//Контейнер валидации формы и ответа сервeра
	statusMessageFoot.classList.add('status');
	formFoot.insertBefore(statusMessageFoot, btnFoot);

	//Валидация формы + маска телефона ===========================
		//Событие input на поле ввода номера телефона
		formFoot.addEventListener('input', function (event) {
			if (event.target == inputFoot[1]) {
				maskInputFoot(event.target);
				validateInputFoot();
			}
		});

		function validateInputFoot() {
			if (event.target.value.lastIndexOf('_') != -1) {
				statusMessageFoot.innerHTML = `<img src="${message.novalidate}" />`;
			} else {
				statusMessageFoot.innerHTML = `<img src="${message.validate}" />`;
			}
		}

		//Функция маски номера телефона
		function maskInputFoot(b) {
			let matrix = b.defaultValue,
				i = 0,
				def = matrix.replace(/\D/g, ""),
				val = b.value.replace(/\D/g, "");
			if (def.length >= val.length) {
				val = def;
			}
			matrix = matrix.replace(/[_\d]/g, function (a) {
				if (val.charAt(i) == "") {
					return "_";
				}
				return val.charAt(i++);
			});
			b.value = matrix;
			if (i == 11) {
				i = 15;
			} else {
				i = matrix.lastIndexOf(val.substr(-1));
			}
			if (i < matrix.length && matrix != b.defaultValue) {
				i++;
			} else {
				i = matrix.indexOf("_");
			}
			setCursorPosition(i, b);
		}

		//Функция определения позиции курсора в поле ввода
		function setCursorPosition(pos, elem) {
			if (pos == 15) {
				return false;
			} else {
				elem.focus();
				if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
				else if (elem.createTextRange) {
					let range = elem.createTextRange();
					range.collapse(true);
					range.moveEnd("character", pos);
					range.moveStart("character", pos);
					range.select();
				}
			}
		}

	//Валидация формы + маска телефона ===========================

	//Отправка данных на сервер ===================================
	formFoot.addEventListener('submit', function (event) {
		event.preventDefault();

		if (event.target.children[1].value.lastIndexOf('_') != -1) {
			statusMessageFoot.innerHTML = `<img src="${message.novalidate}" />`;
			return false;
		} else {
			statusMessageFoot.innerHTML = `<img src="${message.validate}" />`;
		}

		let request = new XMLHttpRequest();
		request.open('POST', 'server.php');
		request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

		let formData = new FormData(formFoot);

		function postData(formData) {
			return new Promise(function (resolve, reject) {
				let obj = {};
				formData.forEach(function (value, key) {
					obj[key] = value;
				});
				let json = JSON.stringify(obj);

				request.send(json);

				request.addEventListener('readystatechange', function () {
					if (request.readyState < 4) {
						resolve();
					} else if (request.readyState === 4 && request.status == 200) {
						resolve();
					} else {
						reject();
					}
				});
			});
		}

		postData(formData).then(() => statusMessageFoot.innerHTML = `<img src="${message.loadind}" />`)
			.then(() => statusMessageFoot.innerHTML = '')
			.catch(() => statusMessageFoot.innerHTML = `<img src="${message.failure}" />`).then(clearInputFoot).then(clearInput);

	});
	//Отправка данных на сервер ===================================

	//Очистка полей инпута при закрытии формы и её отправки
	function clearInputFoot() {
		for (let i = 0; i < inputFoot.length; i++) {
			inputFoot[i].value = "";
		}
	}
	clearInputFoot();
//Отправка формы (footer) ==========================================

//Пишем слайдер ===================================================

	let slideIndex = 1,
		slides = document.querySelectorAll('.slider-item'),
		prev = document.querySelector('.prev'),
		next = document.querySelector('.next'),
		dotsWrap = document.querySelector('.slider-dots'),
		dots = document.querySelectorAll('.dot');


	animateSliderPrev(slideIndex);

	function incrSlides(n) {
		if(n == -1) {
			animateSliderPrev(slideIndex += n);
		} else {
			animateSliderNext(slideIndex += n);
		}
	
	}

	function currentSlide(n) {
		animateSliderPrev(slideIndex = n);
	}

	prev.addEventListener('click', function () {
		incrSlides(-1);
	});
	next.addEventListener('click', function () {
		incrSlides(1);
	});

	dotsWrap.addEventListener('click', function (event) {
		for(let i = 0; i <= dots.length; i++) {
			if(event.target.classList.contains('dot') && event.target == dots[i -1]) {
				currentSlide(i);
			}
		}
	});

	//Анимация слайдера
	function animateSliderPrev(n) {
		if (n > slides.length) {
			slideIndex = 1;
		}
		if (n < 1) {
			slideIndex = slides.length;
		}

		slides.forEach((item) => item.style.display = 'none');
		dots.forEach((item) => item.classList.remove('dot-active'));

			slides[slideIndex - 1].style.display = 'block';
			dots[slideIndex - 1].classList.add('dot-active');
			let prev = 100;

		let animSlider = setInterval(function() {
			if(prev != 0) {
				prev--;
				slides[slideIndex - 1].style.transform = `translateX(${prev}%)`;
			} 
			else {
				clearInterval(animSlider);
			}
		}, 10);
	}

	function animateSliderNext(n) {
		if (n > slides.length) {
			slideIndex = 1;
		}
		if (n < 1) {
			slideIndex = slides.length;
		}

		slides.forEach((item) => item.style.display = 'none');
		dots.forEach((item) => item.classList.remove('dot-active'));

		slides[slideIndex - 1].style.display = 'block';
		dots[slideIndex - 1].classList.add('dot-active');
		let next = -100;

		let animSlider = setInterval(function () {
			if (next != 0) {
				next++;
				slides[slideIndex - 1].style.transform = `translateX(${next}%)`;
			}
			else {
				clearInterval(animSlider);
			}
		}, 10);
	}


//Кулькулятор ===================================================

	let persons = document.querySelectorAll('.counter-block-input')[0],
		restDays = document.querySelectorAll('.counter-block-input')[1],
		place = document.getElementById('select'),
		totalValue = document.getElementById('total'),
		personsSum = 0,
		daysSum = 0,
		total = 0,
		selOption = 0;

		totalValue.textContent = 0;

		persons.addEventListener('input', function () {
				personsSum = +this.value;
				selOption = place.options[place.selectedIndex].value;
				total = (daysSum + personsSum) * 4000 * +selOption;

				if (personsSum == '' || personsSum == '0' || restDays.value == '' || restDays.value == '0') {
					totalValue.textContent = 0;
				} else {
					animateCalc(total);
				}
		});


		restDays.addEventListener('input', function () {

				daysSum = +this.value;
				selOption = place.options[place.selectedIndex].value;
				total = (daysSum + personsSum) * 4000 * +selOption;

				if (daysSum == '' || daysSum == '0' || persons.value == '' || persons.value == '0') {
					totalValue.textContent = 0;
				} else {
					animateCalc(total);
				}

		});

		persons.onkeypress = function (event) {
			if (event.key == '+' || event.key == 'e' || event.key == ',' || event.key == '.' || event.key == '-' || event.key == 'E') {
				return false;
			}
		}

		restDays.onkeypress = function (event) {
			if (event.key == '+' || event.key == 'e' || event.key == ',' || event.key == '.' || event.key == '-' || event.key == 'E') {
				return false;
			}
		}

		place.addEventListener('change', function() {
			selOption = place.options[place.selectedIndex].value;
			total = (daysSum + personsSum) * 4000 * +selOption;
			if (personsSum == '' || personsSum == '0' || restDays.value == '' || restDays.value == '0') {
				totalValue.textContent = 0;
			} else {
				animateCalc(total);
			}
		});

		function animateCalc(result) {
				let num = 0;
				let anim = setInterval(() => {
					if(num != result) {
						if (!personsSum == '' || !personsSum == '0' || !restDays.value == '' || !restDays.value == '0') {
							num += 400;
							totalValue.textContent = num;
						} else {
							clearInterval(anim);
						}
					} else {
						clearInterval(anim);
					}
				}, 5);
		}

});