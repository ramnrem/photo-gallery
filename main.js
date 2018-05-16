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
		slidesWidth,
		currentImage,
		currentMargin,
		clickedImage;

	// Открытие медиа режима
	$('.showModal').click(function(){

		//Номер кликнутой картинки
		clickedImage = parseInt(this.className.replace(/[^0-9]/gim,'')) - 1; 

		//Анимируется добавление прозрачности галереи 
		$('.gallery').animate({
			opacity: '0'
		})

		//Появление окна медиа режима
		$('#galleryModal').css('display', 'block');

		//Текущая картинка
		currentImage = clickedImage;

		//Текущий отступ
		currentMargin = 0;

		//Ширина линии слайдов
		slidesWidth = 0;

		//Массив слайдов
		slide = document.getElementsByClassName('slide');

		//Пподсчет ширины всех слайдов
		for(let i = 0; i < slide.length; i++) {
			slidesWidth = slidesWidth + slide[i].clientWidth + 10;
		}

		$('.slides').css('width', slidesWidth);

		//Вычисление отступа для помещения кликнутой картинки в текущий слайд
		if(clickedImage > 0) {
			for(let i = 0; i < clickedImage; i++){
				currentMargin = currentMargin - slide[i].clientWidth - 10;
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
		})
	
	});

	// Закрытие медиа режима
	$(window).click(function(e){
		if(e.target == modal){
			//Анимируется удаление прозрачности у галереи 
			$('.gallery').animate({
				opacity: '1'
			}, 1000)

			//Исчезает окно медиа режима
			$('#galleryModal').css('display', 'none');

			//Обновляется внешний отступ для анимации при повторной открытии медио режима
			$('.slides').css('margin-left','100%');

		}
	});
	$('#close-btn').click(function(){
		$('.gallery').animate({
			opacity: '1'
		}, 1500)

		//Исчезает окно медиа режима
		$('#galleryModal').css('display', 'none');


		//Обновляется внешний отступ для анимации при повторной открытии медио режима
		$('.slides').animate({
			marginLeft: '100%'
		});
	});

	//Клик вправо
	$('#arrow-right').click(function(){
		
		//Ширина линии слайдой без последнего элемента
		let x = -(slidesWidth - slide[slide.length - 1].clientWidth - 10);

		if(currentMargin > x) {
			currentMargin = currentMargin - slide[currentImage].clientWidth - 10;
			$('.slides').animate({
				marginLeft: currentMargin
			});
			currentImage++;
			
		// Клик вправо при последнем элементе
		}else{
			$('.slides').animate({
				marginLeft: '0'
			});
			currentMargin = 0;
			currentImage = 0;
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

		let x = -(slidesWidth - slide[slide.length - 1].clientWidth + 10);

		if(currentMargin == -20 || currentMargin == 0) {
			currentMargin = x;
			$('.slides').animate({
				marginLeft: currentMargin
			})
			currentImage = slide.length - 1;

		}else {
			currentMargin = currentMargin + slide[currentImage - 1].clientWidth + 10;
			$('.slides').animate({
				marginLeft: currentMargin
			})
			currentImage--;
		}

		disableFilters(slide[currentImage]);

		if(currentImage+1 != slide.length) {
			enableFilters(slide[currentImage + $('#slider').isOverflowing(
				slide[currentImage],
				slide[currentImage+1],
				slide[currentImage+2])]);
		}

	});

	$(modal).bind('mousewheel', function(e){
		if(e.originalEvent.wheelDelta /120 > 0) {
			let x = -(slidesWidth - slide[slide.length - 1].clientWidth - 10);

			if(currentMargin > x) {
				currentMargin = currentMargin - slide[currentImage].clientWidth - 10;
				$('.slides').animate({
					marginLeft: currentMargin
				})
				currentImage++;
			}else{
				$('.slides').animate({
					marginLeft: '0'
				})
				currentMargin = 0;
				currentImage = 0;
			}
			disableFilters(slide[currentImage]);

			if(currentImage+1 != slide.length) {
				enableFilters(slide[currentImage + $('#slider').isOverflowing(
					slide[currentImage],
					slide[currentImage+1],
					slide[currentImage+2])]);
			}
			
		}
		else{
			let x = -(slidesWidth - slide[slide.length - 1].clientWidth + 10);

			if(currentMargin == -20 || currentMargin == 0) {
				currentMargin = x;
				$('.slides').animate({
					marginLeft: currentMargin
				})
				currentImage = slide.length - 1;

			}else {
				currentMargin = currentMargin + slide[currentImage - 1].clientWidth + 10;
				$('.slides').animate({
					marginLeft: currentMargin
				})
				currentImage--;
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

});