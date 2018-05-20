$('document').ready(function() {

	$(window).resize(function(){

	})


	//Проверка вместимости слайдов
	$.fn.isOverflowing = function(child1,child2,child3) {
		let p = $(this).get(0);
		let el1 = $(child1).get(0);
		let el2 = $(child2).get(0);
		let el3 = $(child3).get(0);
		if( p.offsetWidth < el1.offsetWidth + el2.offsetWidth) {
			return 1;
		} else if(p.offsetWidth < el1.offsetWidth + el2.offsetWidth + el3.offsetWidth) {
			return 2;	
		} else return 0;
	};

	//Проверка вместимости menu-point
	$.fn.isMenuOverflowing = function(slide) {
		let p = $(this).get(0);
		let el_slide = $(slide).get(0);
		let el_menu = 318;
		if( p.offsetWidth >= (el_slide.offsetWidth + el_menu)) {
			return 0; //menu-point вмещается

		} else if(p.offsetWidth < el_slide.offsetWidth + el_menu) {
			let width = (el_slide.offsetWidth + el_menu) - p.offsetWidth;
			return width; //menu-point не вмещается
		} 
	};

	//Функция применяющия фильтры на слайд 
	function enableFilters (slide) {
		$(slide).animate({
			opacity: '0.5'
		});

		slide.style.filter = 'brightness(65%)';	
	}

	//Функция удаляющая фильтры на слайде
	function disableFilters (slide) {
		$(slide).animate({
			opacity: '1'
		});
		slide.style.filter = 'brightness(100%)';
	}

	//Получаем элемент модального окна
	let modal = document.getElementById('galleryModal');

	let slide,
		m_slide,
		slidesWidth,
		currentImage,
		currentMargin,
		clickedImage,
		m_clickedImage,
		m_currentMargin,
		m_slidesWidth,
		m_currentImage,
		menuMargin,
		isMenuClicked = 0,
		isLinkClicked = 0;


	// Открытие медиа режима
	$('.showModal').click(function(){

		//Номер кликнутой картинки
		clickedImage = parseInt(this.className.replace(/[^0-9]/gim,'')) - 1; 

		//Анимируется добавление прозрачности галереи 
		$('.gallery').animate({
			opacity: '0'
		}, 500)

		//Появление окна медиа режима
		$('#galleryModal').css('display', 'block');

		//Текущая картинка
		currentImage = clickedImage;
		m_currentImage = clickedImage;

		//Текущий отступ
		currentMargin = 0;
		m_currentMargin = 0;

		//Ширина линии слайдов
		slidesWidth = 0;
		m_slidesWidth = 0;

		//Массив слайдов
		slide = document.getElementsByClassName('slide');
		m_slide = document.getElementsByClassName('mini-slide');


		//Пподсчет ширины всех слайдов
		for(let i = 0; i < slide.length; i++) {
			slidesWidth = slidesWidth + slide[i].offsetWidth + 10;
			m_slidesWidth = m_slidesWidth + m_slide[i].offsetWidth + 10
		}
		
		//костыль, пересчитывающий отступ при сворачивании-разворачивании окна браузера
		$(window).resize(function(){
			currentMargin = 0;
			slidesWidth = 0;
			m_slidesWidth = 0;
			m_currentMargin = 0;

			for(let i = 0; i < slide.length; i++) {
				slidesWidth = slidesWidth + slide[i].offsetWidth + 10;
				m_slidesWidth = m_slidesWidth + m_slide[i].offsetWidth + 10
			}
			
			for(let i = 0; i < currentImage; i++){
				currentMargin = currentMargin - slide[i].offsetWidth - 10;
				m_currentMargin = m_currentMargin - m_slide[i].offsetWidth - 10
			}
			
			$('.slides').css('margin-left', currentMargin);
			$('.mini-slides').css('margin-left', m_currentMargin);
		})

		//Запас на анимацию при наведении
		m_slidesWidth = m_slidesWidth + 300;

		//Клик на пункт меню
		$('.menu-point-link').click(function(){
			if(isLinkClicked === 0) {
				menuMargin = $('#slider').isMenuOverflowing(slide[currentImage]);
				currentMargin = currentMargin - menuMargin;
				$('.slides').animate({
					marginLeft: currentMargin
				}, 670)

				$(this).parent().parent().find('.menu-point').css('display','block');

				console.log($(this).hasClass('info'));

				if($(this).hasClass('info'))
					$('.point-info').css('display','block');
				else if($(this).hasClass('comm'))
					$('.point-comm').css('display','block');
				else $('.point-like').css('display','block');
				
				slidesWidth = slidesWidth + 318;
				$('.slides').css('width', slidesWidth);

				$(this).parent().parent().animate({
					marginRight: '328',
				});

				$(this).parent().parent().find('.menu-point').animate({
					opacity: 1
				},600);
				setTimeout(function() {
					isLinkClicked = 1;
				},300);
			}
			
		})

		$('.slides').css('width', slidesWidth);
		$('.mini-slides').css('width', m_slidesWidth);

		//Вычисление отступа для помещения кликнутой картинки в текущий слайд
		if(clickedImage > 0) {
			for(let i = 0; i < clickedImage; i++){
				currentMargin = currentMargin - slide[i].offsetWidth - 10;
				m_currentMargin = m_currentMargin - m_slide[i].offsetWidth - 10
			}
		}

		//Выключить фильтр слайдам в видимой области
		disableFilters(slide[currentImage]);

		//Включить фильтр слайдам вне видимой области
		if(currentImage+1 != slide.length) {
			enableFilters(slide[currentImage + $('#slider').isOverflowing(
				slide[currentImage],
				slide[currentImage+1],
				slide[currentImage+2])]);
		}


		//Анимируется подъезжание слайдов
		$('.slides').animate({
			marginLeft: currentMargin
		}, 670)
		
		$('.mini-slides').animate({
			marginLeft: m_currentMargin
		}, 1000)

		$('#slider').addClass('slider-active');

		setTimeout(function() {
			$('#slider').addClass('slider-postactive');
		}, 2000);

		

		//Стилизация мини-слайдера при наведении 
		let op065 = null, 
			op0   = null;

		//Нажатие на кнопку меню
		$('.arrow-menu').click(function(){
			if(isMenuClicked === 0){
				isMenuClicked = 1;
				$(this).parent().find('.slide-menu-content').css('display','block');
				$(this).parent().find('.slide-menu').css('display','block');
				$(this).css('transform', 'rotate(180deg)');
				$(this).parent().find('.slide-menu-content').animate({
					opacity: '1',
					right: '0'
				},300);
				$(this).parent().find('.slide-menu').animate({
					opacity: '0.369',
					right: '0'
				},300);
				$(this).parent().find('img').css('filter', 'blur(2px) brightness(65%)');
				$('#mini-slider').css('display', 'none');

			}else{
				isMenuClicked = 0;
				$(this).css('transform', 'rotate(360deg)');
				$(this).parent().find('.slide-menu-content').animate({
					opacity: '0',
					right: '-293'
				},300);
				$(this).parent().find('.slide-menu').animate({
					opacity: '0',
					right: '-293'
				},300);
				$(this).parent().find('img').css('filter', 'blur(0) brightness(100%)');
				$('#mini-slider').css('display', 'block');
				setTimeout(function(){
					$('.slide-menu-content').css('display','none');
					$('.slide-menu').css('display','none');
				},300)
			}
		});

		//курсор над кнопкой меню
		$('.arrow-menu').hover(function(){
			//Нажатие не было произведено 
			if(isMenuClicked === 0){

				$(this).parent().find('.slide-menu-content').css('display','block');
				$(this).parent().find('.slide-menu').css('display','block');
				$(this).css('transform', 'rotate(180deg)');
				$(this).parent().find('.slide-menu-content').animate({
					opacity: '1',
					right: '0'
				},300);
				$(this).parent().find('.slide-menu').animate({
					opacity: '0.369',
					right: '0'
				},300);
				$(this).parent().find('img').css('filter', 'blur(2px) brightness(65%)');
			}
		},function(){
			$(this).parent().find('.slide-menu-content').css('display','block');
			$(this).parent().find('.slide-menu').css('display','block');
		});
		$('.slide-menu-content').hover(function(){
		}, function(){
			if(isMenuClicked === 0 && isLinkClicked === 0){
				$(this).parent().find('.arrow-menu').css('transform', 'rotate(360deg)');
				$(this).animate({
					opacity: '0',
					right: '-293'
				},300);
				$(this).parent().find('.slide-menu').animate({
					opacity: '0',
					right: '-293'
				},300);
				$(this).parent().find('img').css('filter', 'blur(0) brightness(100%)');
				setTimeout(function(){
					$('.slide-menu-content').css('display','none');
					$('.slide-menu').css('display','none');
				},300)

			}		
		});

		//анимация появления миниатюр
		$('#mini-slider').hover(function(){

			$(this).css('opacity', '1');

			$(this).bind('mousemove', function(e){

				if (op065 !== null && op0 !== null) {
					clearTimeout(op065);
					clearTimeout(op0);
				}

				let x = e.clientX,
					y = e.clientY;

				$(this).css('opacity', '1');

				op065 = setTimeout(function() {
					if(x == e.clientX && y == e.clientY)
						$('#mini-slider').css('opacity', '0.65');
				}, 2000);

				op0 = setTimeout(function() {
					if(x == e.clientX && y == e.clientY)
						$('#mini-slider').css('opacity', '0');
				}, 5000);

			});
		},function(){
			$(this).css('opacity', '0'); // 0
			if (op065 !== null && op0 !== null) {
				clearTimeout(op065);
				clearTimeout(op0);
			}
		});
	
	});

	// Закрытие медиа режима
	$(window).click(function(e){
		if(e.target == modal){
			//Анимируется удаление прозрачности у галереи 
			$('.gallery').animate({
				opacity: '1'
			}, 1000)

			$('#slider').removeClass('slider-active');
			$('#slider').removeClass('slider-postactive');

			//Обновляется внешний отступ для анимации при повторной открытии медио режима
			$('.slides').animate({
				marginLeft: '100%'
			});
			$('.mini-slides').animate({
				marginLeft: '100%'
			});

			//Исчезает окно медиа режима
			setTimeout(function() {
				$('#galleryModal').css('display', 'none');
			}, 500);

		}

		//клик вне slide-menu-content закрывает меню
		let btn = document.getElementsByClassName('arrow-menu')[currentImage];
		let sld = $('.slide-menu-content');

		if (e.target != btn && !sld.is(e.target) && sld.has(e.target).length === 0){
			isMenuClicked = 0;
			$('.arrow-menu').css('transform', 'rotate(360deg)');
			$('.slide-menu-content').animate({
				opacity: '0',
				right: '-293'
			},300);
			$('.slide-menu').animate({
				opacity: '0',
				right: '-293'
			},300);
			$('img').css('filter', 'blur(0) brightness(100%)');
			$('#mini-slider').css('display', 'block');
			setTimeout(function(){
				$('.slide-menu-content').css('display','none');
				$('.slide-menu').css('display','none');
			},300)
		}

		let mpoint = $('.menu-point')
		if (!mpoint.is(e.target) && mpoint.has(e.target).length === 0 && isLinkClicked === 1){

			currentMargin = currentMargin + menuMargin;
			$('.slides').animate({
				marginLeft: currentMargin
			}, 670)

			isLinkClicked = 0;
			slidesWidth = slidesWidth - 318;
			$('.slides').animate({width: slidesWidth});

			$('.slide').animate({
				marginRight: '10'
			},300)
			$('.menu-point').animate({
				opacity: 0
			},150);
			setTimeout(function(){
				$('.menu-point').css('display','none');
				$('.point-like').css('display','none');
				$('.point-comm').css('display','none');
				$('.point-info').css('display','none');
			},300)
		}
	});

	$('#close-btn').click(function(){
		$('.gallery').animate({
			opacity: '1'
		}, 1500)

		$('#slider').removeClass('slider-active');
		$('#slider').removeClass('slider-postactive');

		

		//Обновляется внешний отступ для анимации при повторной открытии медио режима
		$('.slides').animate({
			marginLeft: '100%'
		});
		$('.mini-slides').animate({
			marginLeft: '100%'
		});

		//Исчезает окно медиа режима
		setTimeout(function() {
			$('#galleryModal').css('display', 'none');
		}, 500);
		
	});

	//Клик вправо
	$('#arrow-right').click(function(){
		
		//Ширина линии слайдой без последнего элемента
		let x = -(slidesWidth - slide[slide.length - 1].offsetWidth - 10);

		if(currentMargin > x) {
			currentMargin = currentMargin - slide[currentImage].offsetWidth - 10;
			m_currentMargin = m_currentMargin - m_slide[m_currentImage].offsetWidth - 10;
			$('.slides').animate({
				marginLeft: currentMargin
			});
			$('.mini-slides').animate({
				marginLeft: m_currentMargin
			});
			currentImage++;
			m_currentImage++;
		// Клик вправо при последнем элементе
		}else{
			$('.slides').animate({
				marginLeft: '0'
			});
			$('.mini-slides').animate({
				marginLeft: '0'
			});
			currentMargin = 0;
			currentImage = 0;
			m_currentMargin = 0;
			m_currentImage = 0;
		}

		disableFilters(slide[currentImage]);

		if(currentImage+1 != slide.length) {
			enableFilters(slide[currentImage + $('#slider').isOverflowing(
				slide[currentImage],
				slide[currentImage+1],
				slide[currentImage+2])]);
		}
		
	});

	//Клик влево
	$('#arrow-left').click(function(){

		let x = -(slidesWidth - slide[slide.length - 1].offsetWidth + 10);
		let y = -(m_slidesWidth - m_slide[slide.length - 1].offsetWidth + 10 - 320);

		if(currentMargin == -20 || currentMargin == 0) {
			currentMargin = x;
			m_currentMargin = y;
			$('.slides').animate({
				marginLeft: currentMargin
			})
			$('.mini-slides').animate({
				marginLeft: m_currentMargin
			})
			currentImage = slide.length - 1;
			m_currentImage = slide.length - 1;

		}else {
			currentMargin = currentMargin + slide[currentImage - 1].offsetWidth + 10;
			m_currentMargin = m_currentMargin + m_slide[m_currentImage - 1].offsetWidth + 10;
			$('.slides').animate({
				marginLeft: currentMargin
			})
			$('.mini-slides').animate({
				marginLeft: m_currentMargin
			})
			currentImage--;
			m_currentImage--;
		}

		disableFilters(slide[currentImage]);

		if(currentImage+1 != slide.length) {
			enableFilters(slide[currentImage + $('#slider').isOverflowing(
				slide[currentImage],
				slide[currentImage+1],
				slide[currentImage+2])]);
		}

	});

	$('#slider').bind('mousewheel', function(e){

		let sld = $('.slide-menu-content');
		if(e.originalEvent.wheelDelta /120 > 0 && !sld.is(e.target) && sld.has(e.target).length === 0) {   //edit scroll here
			let x = -(slidesWidth - slide[slide.length - 1].offsetWidth - 10);
		
			if(currentMargin > x) {
				currentMargin = currentMargin - slide[currentImage].offsetWidth - 10;
				m_currentMargin = m_currentMargin - m_slide[m_currentImage].offsetWidth - 10;
				$('.slides').animate({
					marginLeft: currentMargin
				});
				$('.mini-slides').animate({
					marginLeft: m_currentMargin
				});
				currentImage++;
				m_currentImage++;
			}else{
				$('.slides').animate({
					marginLeft: '0'
				});
				$('.mini-slides').animate({
					marginLeft: '0'
				});
				currentMargin = 0;
				currentImage = 0;
				m_currentMargin = 0;
				m_currentImage = 0;
			}

			disableFilters(slide[currentImage]);

			if(currentImage+1 != slide.length) {
				enableFilters(slide[currentImage + $('#slider').isOverflowing(
					slide[currentImage],
					slide[currentImage+1],
					slide[currentImage+2])]);
			}
			
		}
		else if(e.originalEvent.wheelDelta /120 < 0 && !sld.is(e.target) && sld.has(e.target).length === 0){   //and here
			let x = -(slidesWidth - slide[slide.length - 1].offsetWidth + 10);
			let y = -(m_slidesWidth - m_slide[slide.length - 1].offsetWidth + 10 - 320);

			if(currentMargin == -20 || currentMargin == 0) {
				currentMargin = x;
				m_currentMargin = y;
				$('.slides').animate({
					marginLeft: currentMargin
				})
				$('.mini-slides').animate({
					marginLeft: m_currentMargin
				})
				currentImage = slide.length - 1;
				m_currentImage = slide.length - 1;

			}else {
				currentMargin = currentMargin + slide[currentImage - 1].offsetWidth + 10;
				m_currentMargin = m_currentMargin + m_slide[m_currentImage - 1].offsetWidth + 10;
				$('.slides').animate({
					marginLeft: currentMargin
				})
				$('.mini-slides').animate({
					marginLeft: m_currentMargin
				})
				currentImage--;
				m_currentImage--;
			}

			disableFilters(slide[currentImage]);

			if(currentImage+1 != slide.length) {
				enableFilters(slide[currentImage + $('#slider').isOverflowing(
					slide[currentImage],
					slide[currentImage+1],
					slide[currentImage+2])]);
			}
		}
	});

	//мини клик вправо 
	$('#mini-arrow-right').click(function(){
		
		let x = -(m_slidesWidth - m_slide[slide.length - 1].offsetWidth - 10 - 320);

		if(m_currentMargin > x) {
			m_currentMargin = m_currentMargin - m_slide[m_currentImage].offsetWidth - 10;
			$('.mini-slides').animate({
				marginLeft: m_currentMargin
			});
			m_currentImage++;
		// Клик вправо при последнем элементе
		}else{
			$('.mini-slides').animate({
				marginLeft: '0'
			});
			m_currentMargin = 0;
			m_currentImage = 0;
		}
	});

	$('#mini-arrow-left').click(function(){

		let y = -(m_slidesWidth - m_slide[slide.length - 1].offsetWidth + 10 - 320);

		if(m_currentMargin == -20 || m_currentMargin == 0) {
			m_currentMargin = y;
			$('.mini-slides').animate({
				marginLeft: m_currentMargin
			})
			m_currentImage = slide.length - 1;
		}else {
			m_currentMargin = m_currentMargin + m_slide[m_currentImage - 1].offsetWidth + 10;
			$('.mini-slides').animate({
				marginLeft: m_currentMargin
			})
			m_currentImage--;
		}
	});

	$('.mini-slides').bind('mousewheel', function(){
		if(e.originalEvent.wheelDelta /120 > 0) {
			let x = -(m_slidesWidth - m_slide[slide.length - 1].offsetWidth - 10 - 320);

			if(m_currentMargin > x) {
				m_currentMargin = m_currentMargin - m_slide[m_currentImage].offsetWidth - 10;
				$('.mini-slides').animate({
					marginLeft: m_currentMargin
				});
				m_currentImage++;
			// Клик вправо при последнем элементе
			}else{
				$('.mini-slides').animate({
					marginLeft: '0'
				});
				m_currentMargin = 0;
				m_currentImage = 0;
			}
		}
		else{
			let y = -(m_slidesWidth - m_slide[slide.length - 1].offsetWidth + 10 - 320);

			if(m_currentMargin == -20 || m_currentMargin == 0) {
				m_currentMargin = y;
				$('.mini-slides').animate({
					marginLeft: m_currentMargin
				})
				m_currentImage = slide.length - 1;
			}else {
				m_currentMargin = m_currentMargin + m_slide[m_currentImage - 1].offsetWidth + 10;
				$('.mini-slides').animate({
					marginLeft: m_currentMargin
				})
				m_currentImage--;
			}
		}
	});

	//Клик на мини слайд
	$('.mini-slide').click(function(){
		m_clickedImage = parseInt(this.className.replace(/[^0-9]/gim,'')) - 1; 

		m_currentImage = m_clickedImage;
		m_currentMargin = 0;
		currentImage = m_clickedImage;
		currentMargin = 0;

		if(m_currentImage > 0) {
			for(let i = 0; i < m_currentImage; i++){
				m_currentMargin = m_currentMargin - m_slide[i].offsetWidth - 10;
				currentMargin = currentMargin - slide[i].offsetWidth - 10;
			}
		}

		disableFilters(slide[currentImage]);

		if(currentImage+1 != slide.length) {
			enableFilters(slide[currentImage + $('#slider').isOverflowing(
				slide[currentImage],
				slide[currentImage+1],
				slide[currentImage+2])]);
		}

		$('.slides').animate({
			marginLeft: currentMargin
		}, 1000)

		$('.mini-slides').animate({
			marginLeft: m_currentMargin
		}, 1000)
	})

});

/*	
	4) Движение скроллом мыши не естественно (прыгают картинки из угла в угол, не соответствуя движениям мыши);
*/