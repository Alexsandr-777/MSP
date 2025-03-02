
document.addEventListener('DOMContentLoaded', function () {
	// строка поиска
	const searchInput = document.getElementById('user-search')
	//окно с вариантами
	const suggestionsContainer = document.getElementById('suggestions')
	//список вариантов
	const suggestionsList = document.getElementById('suggestions-list')
	//контейнер в который будут добавляться варианты анализов
	const analysisOptionsContainer = document.getElementById(
		'analysis-options-container'
	)
	// выпадающий блок с вариантами анализов
	const analysisResults = document.getElementById('analysis-results')
	//информационный текст в окне с анализами
	const analysisInfo = document.getElementById('analysis-info')
	//кнопка поиска
	const searchButton = document.querySelector('.container__but-search')
	//кнопка сброса
	const resetButton = document.querySelector('.btn-reset')
	//кнопка копировать
	const copyButton = document.querySelector('.btn-copy')
	//контейнер уведомлений
	const notificationContainer = document.querySelector(
		'.notification-container'
	)
	//окно ошибки, предел вариантов поиска
	const errorPopup = document.querySelector('.error-popup')
	//кнопка окна ошибка
	const errorPopupBtn = document.querySelector('.error-popup__btn-error')
	//окно основн
	const windowEl = document.querySelector('.window')
	//кнопка закрыть окно
	const closeButton = document.querySelector('.head__item-nav.close-window')
	//кнопка свернуть окно
	const minimizeButton = document.querySelector(
		'.head__item-nav.minimize-window'
	)

	// Массив диагнозов
	const diagnoses = [
		'№70.0  острый сальпингит и оофорит',
		'Ангина острая',
		'Грипп вирусный',
		'Острый бронхит',
		'Пневмония бактериальная',
		'Хронический гастрит',
		'Язвенная болезнь желудка',
		'Острый пиелонефрит',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Мигрень',
		'Гипертоническая болезнь',
		'Сахарный диабет 2 типа',
		'Аллергический ринит',
	]

	// Маппинг анализов (в нижнем регистре)
	const analysesMapping = {
		'№70.0  острый сальпингит и оофорит': [
			'Анализ крови общий: эритроциты, гемоглобин, гематокрит, тромбоциты, лейкоциты и лейкоцитарная формула, скорость оседания эритроцитов.',
			'Биохимическое исследование крови (билирубин, глюкоза, мочевина, креатинин, общий белок, аланинаминотрансфераза, аспартатаминотрансфераза, электролиты (калий, натрий, кальций).',
			'Коагулограмма - активированное частичное тромбиновое время, протромбиновый индекс, протромбиновое время, международное нормализованное отношение, фибриноген.',
			'Анализ мочи общий',
			'Электрокардиография (ЭКГ).',
			'УЗИ молочных желез.',
			'Кольпоскопия простая и расширенная (кольпоскопия).',
			'УЗИ органов малого таза.',
			'Консультация врача-терапевта.',
		],
	}

	// Подсказки при вводе
	searchInput.addEventListener('input', function () {
		let query = searchInput.value.trim().toLowerCase()
		suggestionsList.innerHTML = ''
		//поиск по первым 3 символам
		if (query.length >= 3) {
			const filtered = diagnoses.filter(item =>
				item.toLowerCase().includes(query)
			)
			// вызов окна ощибки при превышении лимита(20 шт) возврат в окно поиска
			if (filtered.length > 20) {
				errorPopup.classList.add('error-popup__active')
				searchInput.setAttribute('disabled', 'true')
				searchInput.blur()
				return
			}
			//стили для объединения строки поиска и выпадающего списка вариантов
			if (filtered.length > 0) {
				filtered.forEach(item => {
					const li = document.createElement('li')
					li.textContent = item
					li.addEventListener('click', function () {
						searchInput.value = item
						suggestionsContainer.style.display = 'none'
					})
					suggestionsList.appendChild(li)
				})
				suggestionsContainer.style.display = 'block'
			} else {
				suggestionsContainer.style.display = 'none'
			}
		} else {
			suggestionsContainer.style.display = 'none'
		}
	})

	// Закрытие всплывающего списка при клике вне его области
	document.addEventListener('click', function (event) {
		if (
			!searchInput.contains(event.target) &&
			!suggestionsContainer.contains(event.target)
		) {
			suggestionsContainer.style.display = 'none'
		}
	})

	// Закрытие ошибки
	errorPopupBtn.addEventListener('click', function () {
		errorPopup.classList.remove('error-popup__active')
		searchInput.removeAttribute('disabled')
		searchInput.focus()
	})

	// Сброс поля поиска и результатов
	resetButton.addEventListener('click', function () {
		searchInput.value = ''
		suggestionsContainer.style.display = 'none'
		analysisResults.style.display = 'none'
		analysisOptionsContainer.innerHTML = ''
		analysisInfo.innerHTML = ''
	})

	// ошибка при вводе в строку менее 3 символов
	searchButton.addEventListener('click', function (event) {
		event.preventDefault()
		let query = searchInput.value.trim()
		if (query.length < 3) {
			showNotification('Введите название диагноза')
			return
		}

		// Проверка что введённый диагноз существует
		const selectedDiagnosis = diagnoses.find(
			item => item.toLowerCase() === query.toLowerCase()
		)
		if (!selectedDiagnosis) {
			showNotification('Диагноз не найден.')
			return
		}

		// анализ вариантов анализов для выбранного диагноза в противном случае ошибка
		const analyses = analysesMapping[selectedDiagnosis.toLowerCase()]
		if (!analyses || analyses.length === 0) {
			showNotification('Нет данных')
			return
		}

		// Очищаем предыдущие варианты анализов
		analysisOptionsContainer.innerHTML = ''

		//текст протокола
		analysisInfo.textContent =
			'Клинический протокол “Медицинское наблюдение и оказание медицинской помощи женщинам в акушерстве и гинекологии” (утвержден постановлением Министерства здравоохранения Республики Беларусь от 19.02.2018 № 17). Изменения: постановление Министерства здравоохранения Республики Беларусь от 9 февраля 2024 г.'

		// вызываем шаблон анализов
		const template = document.getElementById('analysis-item-template')
		analyses.forEach(item => {
			// Клонируем шаблон
			const clone = template.content.cloneNode(true)

			// смотрим элементы внутри клона
			const resultItem = clone.querySelector('.analysis-result-item')
			const checkbox = clone.querySelector('.analysis-option-checkbox')
			const label = clone.querySelector('label')
			const infoButton = clone.querySelector('.tooltip-container__info-button')
			const infoTooltip = clone.querySelector(
				'.tooltip-container__info-tooltip'
			)
			const tooltipTextContainer = clone.querySelector(
				'.tooltip-container__tooltip-text'
			)
			const closeTooltipButton = clone.querySelector(
				'.tooltip-container__close-tooltip'
			)

			//  данные tooltip окна пояснения "?"
			checkbox.value = item
			label.textContent = item
			tooltipTextContainer.textContent = `Тут будет какой-либо поясняющий текст для прочтения пользователем. 
Таким образом, высокотехнологичная концепция общественного уклада прекрасно подходит для реализации кластеризации усилий. Предварительные выводы.`

			// функции для tooltip окна пояснения
			infoButton.addEventListener('click', function (e) {
				e.stopPropagation()
				document
					.querySelectorAll('.tooltip-container__info-tooltip.active')
					.forEach(tooltip => {
						if (tooltip !== infoTooltip) {
							tooltip.classList.remove('active')
						}
					})
				infoTooltip.classList.toggle('active')
			})
			closeTooltipButton.addEventListener('click', function (e) {
				e.stopPropagation()
				infoTooltip.classList.remove('active')
			})

			document.addEventListener('click', function (e) {
				// Если клик не внутри элемента с классом tooltip-container
				if (!e.target.closest('.tooltip-container')) {
					// Закрываем все активные tooltip
					document
						.querySelectorAll('.tooltip-container__info-tooltip.active')
						.forEach(tooltip => {
							tooltip.classList.remove('active')
						})
				}
			})
			// Добавляет клон в контейнер вариантов анализов
			analysisOptionsContainer.appendChild(clone)
		})

		// Делает окно с вариантами анализов видимым
		analysisResults.style.display = 'block'
	})

	// Копирование выбранных анализов в буфер обмена
	copyButton.addEventListener('click', function () {
		const selectedCheckboxes = document.querySelectorAll(
			'.analysis-option-checkbox:checked'
		)
		if (selectedCheckboxes.length === 0) {
			showNotification('Выберите хотя бы один анализ')
			return
		}
		const selectedTexts = Array.from(selectedCheckboxes).map(
			checkbox => checkbox.value
		)
		navigator.clipboard
			.writeText(selectedTexts.join(', '))
			.then(() => showNotification('Анализы скопированы!'))
			.catch(err => console.error('Ошибка копирования: ', err))
	})

	// Закрытие окна: кнопка "X"
	closeButton.addEventListener('click', function () {
		windowEl.style.display = 'none'
	})

	// Сворачивание окна: кнопка "-" (окно сворачивается на высоту шапки)
	minimizeButton.addEventListener('click', function () {
		windowEl.classList.toggle('minimized')
	})

	// Функция показа уведомлений
	function showNotification(message) {
		const notification = document.createElement('div')
		notification.classList.add('notification')
		notification.textContent = message
		notificationContainer.appendChild(notification)

		setTimeout(() => {
			notification.style.opacity = '0'
			setTimeout(() => notification.remove(), 500)
		}, 2000)
	}
})
