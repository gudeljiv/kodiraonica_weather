import styled from '@emotion/styled'
import { createRef, useEffect, useRef, useState } from 'react'
import api from '../helper/db'
import getWeatherHook from '../hooks/GetWeatherHook'
import './WeatherComponent.css'
// import SelectHelper from '../helper/SelectHelper'
// import Select from 'react-select'

const Weather = (props) => {
	const [filters, setFilter] = useState({ city: 'zagreb', days: 1, forecast: 0 })
	const [focused, setFocused] = useState(false)

	let weather = getWeatherHook(filters)

	const inputCityRef = createRef()

	const handleChange = (e) => {
		console.log('change', e.target.value.length)
		// if (e.target.value.length > 2 || e.target.value.length == 0) setFilter({ ...filters, city: e.target.value })
		setFilter({ ...filters, city: e.target.value })
		setFocused(true)
	}

	useEffect(() => {
		console.log('inputCityRef', inputCityRef.current, focused)
		if (focused) inputCityRef.current.focus()
	}, [focused])

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

	const Label = styled.label`
		margin-right: 40px;
	`

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
					<Input autoFocus ref={inputCityRef} defaultValue={filters.city} value={filters.city} onChange={handleChange} width="75%" />

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
