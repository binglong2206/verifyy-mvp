import * as React from 'react';

function SvgCameraVideo(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path
				fillRule='evenodd'
				d='M0 5a2 2 0 012-2h7.5a2 2 0 011.983 1.738l3.11-1.382A1 1 0 0116 4.269v7.462a1 1 0 01-1.406.913l-3.111-1.382A2 2 0 019.5 13H2a2 2 0 01-2-2V5zm11.5 5.175l3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 00-1 1v6a1 1 0 001 1h7.5a1 1 0 001-1V5a1 1 0 00-1-1H2z'
			/>
		</svg>
	);
}

export default SvgCameraVideo;
