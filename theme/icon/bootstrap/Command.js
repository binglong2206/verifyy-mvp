import * as React from 'react';

function SvgCommand(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path d='M3.5 2A1.5 1.5 0 015 3.5V5H3.5a1.5 1.5 0 110-3zM6 5V3.5A2.5 2.5 0 103.5 6H5v4H3.5A2.5 2.5 0 106 12.5V11h4v1.5a2.5 2.5 0 102.5-2.5H11V6h1.5A2.5 2.5 0 1010 3.5V5H6zm4 1v4H6V6h4zm1-1V3.5A1.5 1.5 0 1112.5 5H11zm0 6h1.5a1.5 1.5 0 11-1.5 1.5V11zm-6 0v1.5A1.5 1.5 0 113.5 11H5z' />
		</svg>
	);
}

export default SvgCommand;
