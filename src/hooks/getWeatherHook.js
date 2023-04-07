import { useEffect, useState } from 'react'
import api from '../helper/db'

const getWeatherHook = (filters) => {
	const [weather, setWeather] = useState()

	let api_key = import.meta.env.VITE_WEATHER_API_KEY
	let f = filters.forecast == 1 ? 'forecast.json' : 'current.json'

	let endpoint = `https://api.weatherapi.com/v1/${f}?key=${api_key}&q=${filters.city}&days=${filters.days}&aqi=yes&alerts=yes`

	useEffect(() => {
		const timer = setTimeout(() => {
			api.get(endpoint).then((response) => {
				console.log('filter hook reponse')
				setWeather(response)
			})
		}, 1000)
		return () => clearTimeout(timer)
	}, [filters])

	return weather
}

export default getWeatherHook
