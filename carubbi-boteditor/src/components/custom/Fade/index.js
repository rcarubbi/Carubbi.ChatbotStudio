import React from 'react';
import { Transition } from 'react-transition-group';

const transitionStyles = {
	entering: { opacity: 1 },
	entered: { opacity: 1 },
	exiting: { opacity: 0 },
	exited: { opacity: 0 },
};

function Fade({ in: inProp, duration, children, key: keyProp }) {
	const defaultStyle = {
		transition: `opacity ${duration}ms ease-in-out`,
		opacity: 0,
	};

	return (
		<Transition key={keyProp} appear={true} in={inProp} timeout={duration}>
			{state => (
				<span
					style={{
						...defaultStyle,
						...transitionStyles[state],
					}}
				>
					{children}
				</span>
			)}
		</Transition>
	);
}

export default Fade;
