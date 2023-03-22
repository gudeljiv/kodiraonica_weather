import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import api from '../helper/db'
import './WeatherComponent.css'
// import SelectHelper from '../helper/SelectHelper'
// import Select from 'react-select'

const Weather = (props) => {
	const [weather, setWeather] = useState()
	const [filters, setFilter] = useState({ city: 'zagreb', days: 1, forecast: 0 })
	const [forecast, setForecast] = useState(0)

	useEffect(() => {
		console.log('init weather')
		console.log(import.meta.env.VITE_WEATHER_API_KEY)
	}, [])

	useEffect(() => {
		console.log(filters)
		if (!filters.city) return
		if (!filters.days) return

		const timer = setTimeout(() => {
			getWeather()
		}, 1000)
		return () => clearTimeout(timer)
	}, [filters, forecast])

	useEffect(() => {
		if (!weather) return

		console.log('weather', weather)
	}, [weather])

	const getWeather = async () => {
		// https://api.weatherapi.com/v1/forecast.json?key=81fa2363d43b4ca0aaa90236232203 &q=London&days=7&aqi=yes&alerts=yes
		let api_key = import.meta.env.VITE_WEATHER_API_KEY
		let f = filters.forecast == 1 ? 'forecast.json' : 'current.json'

		let endpoint = `https://api.weatherapi.com/v1/${f}?key=${api_key}&q=${filters.city}&days=${filters.days}&aqi=yes&alerts=yes`

		console.log(endpoint)

		let weather = await api.get(endpoint)
		setWeather(weather)
	}

	// const handleRadioButton = (e, forecast) => {
	// 	e.preventDefault()
	// 	setFilter({ ...filters, forecast: e.target.value })
	// }

	// const handleChange = (e, forecast) => {
	// 	e.preventDefault()
	// 	setFilter({ ...filters, city: e.target.value })
	// }

	const Input = styled.input`
		padding: 10px;
		font-size: 14px;
		border-color: grey;
		border-radius: 4px;
		color: white;
		color: white;
		width: ${(props) => props.width};
		margin-bottom: 20px;
		display: block;
		&:hover {
			border-color: white;
		}
	`

	const RadioButtonWrapper = styled.div`
		display: flex;
		align-items: center;
		height: 48px;
	`

	const RadioButton = styled.input`
		padding: 10px;
		font-size: 14px;
		border-color: grey;
		border-radius: 4px;
		color: white;
		&:hover {
			border-color: white;
		}
	`

	const RadioButtonLabel = styled.label`
		margin-right: 40px;
	`

	const Label = styled.label``

	const DivResult = styled.div`
		margin-top: 40px;
		margin-bottop: 40px;
		padding: 0px;
		font-size: 34px;
		color: white;
		display: ${(props) => props.display};
	`

	return (
		<div>
			<div>
				<form>
					<Label>Grad:</Label>
					<Input
						autoFocus
						defaultValue={filters.city}
						value={filters.city}
						onChange={(e) => setFilter({ ...filters, city: e.target.value })}
						width="75%"
					/>

					<Label>Dana (1-7):</Label>
					<Input
						defaultValue={filters.days}
						value={filters.days}
						onChange={(e) => setFilter({ ...filters, days: e.target.value })}
						width="15%"
					/>

					<RadioButtonWrapper>
						<RadioButton
							type="radio"
							value="0"
							checked={filters.forecast == 0}
							onChange={(e) => setFilter({ ...filters, forecast: e.target.value })}
						/>
						<RadioButtonLabel>One day</RadioButtonLabel>
						<RadioButton
							type="radio"
							value="1"
							checked={filters.forecast == 1}
							onChange={(e) => setFilter({ ...filters, forecast: e.target.value })}
						/>
						<RadioButtonLabel>Forecast 7 days</RadioButtonLabel>
					</RadioButtonWrapper>
				</form>
			</div>

			{weather && (
				<DivResult display={weather ? 'block' : 'none'}>
					{/* Results */}
					{weather?.data?.location && <Location data={weather.data.location} />}
					{weather?.data?.current && <CurrentWeather data={weather.data.current} />}
					{weather?.data?.forecast && <ForecastWeather data={weather.data.forecast} />}
				</DivResult>
			)}
		</div>
	)
}

const Location = ({ data }) => {
	return (
		<div className="location">
			<h2>{data.name}</h2>
			<div className="country">{data.country}</div>
			<div className="date">{data.localtime}</div>
		</div>
	)
}

const CurrentWeather = ({ data }) => {
	return (
		<div className="current">
			<h2>{data.condition.text}</h2>
			<div className="icon">
				<img src={data.condition.icon} />
			</div>
			<div className="wind">
				Wind: {data.wind_dir} {data.wind_kph} kph
			</div>
		</div>
	)
}

const ForecastWeather = ({ data }) => {
	return (
		<div className="forecast">
			{data.forecastday &&
				data.forecastday.map((item) => {
					return <ForecastWeatherDay data={item} />
				})}
		</div>
	)
}

const ForecastWeatherDay = ({ data }) => {
	const [isOpen, setisOpen] = useState(false)

	useEffect(() => {
		console.log(isOpen)
	}, [isOpen])

	return (
		<div className="forecastDay" onClick={(e) => setisOpen(!isOpen)}>
			<div className="date">{data.date}</div>
			<h5>{data.day.condition.text}</h5>
			<div className="icon">
				<img src={data.day.condition.icon} />
			</div>
			<div className="forecastWeatherHourWrapper">
				{data.hour &&
					data.hour.map((item) => {
						return isOpen && <ForecastWeatherHour data={item} />
					})}
			</div>
		</div>
	)
}

const ForecastWeatherHour = ({ data }) => {
	return (
		<div className="forecastHour">
			<div className="date">{data.time}</div>
			<h5>{data.condition.text}</h5>
			<div className="icon">
				<img src={data.condition.icon} />
			</div>
		</div>
	)
}

export default Weather
