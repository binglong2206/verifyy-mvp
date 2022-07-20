
export type ColorType =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'info'
	| 'warning'
	| 'danger'
	| 'light'
	| 'dark';

export interface ThemeColors {
	[key: string]: {
		name: ColorType;
		code: string;
	};
}
const COLORS: ThemeColors = {
	PRIMARY: {
		name: 'primary',
		code: '#6c5dd3',
	},
	SECONDARY: {
		name: 'secondary',
		code: '#ffa2c0',
	},
	SUCCESS: {
		name: 'success',
		code: '#46bcaa',
	},
	INFO: {
		name: 'info',
		code: '#4d69fa',
	},
	WARNING: {
		name: 'warning',
		code: '#ffcf52',
	},
	DANGER: {
		name: 'danger',
		code: '#f35421',
	},
	DARK: {
		name: 'dark',
		code: '#e7eef8',
	},
	LIGHT: {
		name: 'light',
		code: '#1f2128',
	},
};

export function getColorNameWithIndex(index: number) {
	/*
	 * The size has been reduced by one so that the LIGHT color does not come out.
	 */
	// @ts-ignore
	return COLORS[Object.keys(COLORS)[index % (Object.keys(COLORS).length - 1)]].name;
}

export default COLORS;
