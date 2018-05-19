$('document').ready(function() {


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
		m_currentImage;


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

		//Запас на анимацию при наведении
		m_slidesWidth = m_slidesWidth + 300;

		//Клик на пункт меню
		$('.menu-point-link').click(function(){
			slidesWidth = slidesWidth + 318;
			$('.slides').css('width', slidesWidth);

			$(this).parent().parent().animate({
				marginRight: '328',
			})

			$(this).parent().parent().find('.menu-point').animate({
				opacity: 1
			})

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
		}, 1000);
		

		//Стилизация мини-слайдера при наведении 
		let op065 = null, 
			op0   = null;

		let isMenuClicked = 0;

		//Нажатие на кнопку меню
		$('.arrow-menu').click(function(){
			if(isMenuClicked === 0){
				isMenuClicked = 1;
				$('.arrow-menu').css('transform', 'rotate(180deg)');
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
				$('.arrow-menu').css('transform', 'rotate(360deg)');
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
			}
		});

		//курсор над кнопкой меню
		$('.arrow-menu').hover(function(){
			if(isMenuClicked === 0){
				$('.arrow-menu').css('transform', 'rotate(180deg)');
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
			$(this).parent().find('.slide-menu-content').hover(function(){
			}, function(){
				if(isMenuClicked === 0){
					$('.arrow-menu').css('transform', 'rotate(360deg)');
					$(this).animate({
						opacity: '0',
						right: '-293'
					},300);
					$(this).parent().find('.slide-menu').animate({
						opacity: '0',
						right: '-293'
					},300);
					$(this).parent().find('img').css('filter', 'blur(0) brightness(100%)');
				}else{
					$(this).parent().find('.slide-menu-content').animate({
						opacity: '1',
						right: '0'
					},300);
					$(this).parent().find('.slide-menu').animate({
						opacity: '0.369',
						right: '0'
					},300);
				}				
			});
			
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

		console.log(e.originalEvent.wheelDelta)
		if(e.originalEvent.wheelDelta /120 > 0) {   //edit scroll here
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
		else if(e.originalEvent.wheelDelta /120 < 0){   //and here
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

	$('.mini-slides').bind('mousewheel', function(e){
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