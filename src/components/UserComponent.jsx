import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import './User.css'

export default function User(props) {
	const [name, setName] = useState(props.name)

	const Button = styled.button`
		padding: 32px;
		background-color: hotpink;
		font-size: 24px;
		border-radius: 4px;
		color: black;
		font-weight: bold;
		&:hover {
			color: white;
		}
	`

	console.log(props)
	useEffect(() => {
		console.log(props)
	}, [])

	const changeName = () => {
		setName('Marko')
		console.log(name)
	}

	return (
		<div className="User">
			<div className="container">
				<h2>Zadaci korisnika {name}</h2>
				<Button onClick={() => changeName()}>Click Me!</Button>
			</div>
		</div>
	)
}
