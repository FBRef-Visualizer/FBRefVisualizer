import * as React from 'react';
import { FC } from 'react';
import './check.scss';
import Icon, { IconType } from './icon';

interface Props {
  checked: boolean;
  onChange: () => void;
}

const Check: FC<Props> = (props: Props) => {
  const {
    checked,
    onChange
  } = props;

  const iconType = checked ? IconType.CheckBox : IconType.CheckBoxEmpty;
  const className = checked ? 'checked' : 'unchecked';

  return (
	<Icon
		iconType={iconType}
		className={`checkbox ${className}`}
		onClick={onChange}
	/>
  );
};

export default Check;
