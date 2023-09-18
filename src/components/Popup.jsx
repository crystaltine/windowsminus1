import React from 'react';
import '../styles/Popup.css'

const Popup = (props) => {

	const [inputText, setInputText] = React.useState(''); // if input is required

	const callback1 = () => {
		props.input? props.button1(inputText) : props.button1()
		setInputText('')
	}

  return (
    <div id='popup-backdrop' className='centered-popup-backdrop' style={{display: props.visible? 'block' : 'none'}}>
			<div className='popup-body-container'>
				<div className='popup-body'>

					<div 
					className='popup-header'
					dangerouslySetInnerHTML={{__html: props.titleHTML || props.title}} />


					<div 
					className='popup-content'
					dangerouslySetInnerHTML={{__html: props.contentHTML || props.content}} />

					{
						props.input?
						<input
						type='text'
						className='popup-input'
						value={inputText}
						onChange={(e) => setInputText(e.target.value)} /> :
						null
					}

					<div className='flex-spacer' >

						<button onClick={callback1} className='popup-button-primary'>
							{props.button1Text}
						</button>

						<button onClick={props.button2} className='popup-button-secondary'>
							{props.button2Text}
						</button>

					</div>

				</div>
			</div>
    </div>
  );
};

export default Popup;