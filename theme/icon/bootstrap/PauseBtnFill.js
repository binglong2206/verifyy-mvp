import * as React from 'react';

function SvgPauseBtnFill(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path d='M0 12V4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2zm6.25-7C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 102.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 102.5 0v-3.5C11 5.56 10.44 5 9.75 5z' />
		</svg>
	);
}

export default SvgPauseBtnFill;
