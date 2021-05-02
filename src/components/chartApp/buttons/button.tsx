import * as React from 'react';
import { FC, ReactElement } from 'react';
import './button.scss';

interface Props {
	onClick: () => void;
	wrapperClass: string;
	children: ReactElement;
	label: string;
}

const Button: FC<Props> = (props: Props) => {
	const {
		onClick, wrapperClass, children, label
	} = props;

	return (
		<div className={wrapperClass}>
			<button title={label} onClick={onClick} className="button" type="button">
				<span>
					{label}
				</span>
				{children}
			</button>
		</div>
	);
};

export default Button;
