import React, { useContext, useRef, useState } from 'react';
import classNames from 'classnames';
import { motion, MotionStyle } from 'framer-motion';
import Brand from '../Brand/Brand';
import Navigation, { NavigationLine } from '../Navigation/Navigation';
import User from '../User/User';
import { dashboardMenu, layoutMenu } from '../../menu';
import ThemeContext from '../../contexts/themeContext';
import useAsideTouch from '../../hooks/useAsideTouch';

const SideBar = () => {
	const { asideStatus, setAsideStatus } = useContext(ThemeContext);
	const { asideStyle } = useAsideTouch();

	return (
		<>
			<motion.aside
				style={asideStyle as MotionStyle}
				className={classNames('aside', { open: asideStatus })}>
				<div className='aside-head'>
					<Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
				</div>
				<div className='aside-body'>
					<Navigation menu={dashboardMenu} id='aside-dashboard' />
					<>
						<NavigationLine />
						<Navigation menu={layoutMenu} id='aside-menu' />
					</>
				</div>
				<div className='aside-foot'>
					<User />
				</div>
			</motion.aside>
		</>
	);
};

export default SideBar;
