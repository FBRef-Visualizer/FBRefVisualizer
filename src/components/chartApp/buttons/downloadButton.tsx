import * as React from 'react';
import { FC } from 'react';
import Icon, { IconType } from '../../generic/icon';
import Button from './button';
import './downloadButton.scss';

interface Props {
  hide: () => void;
}

const Download: FC<Props> = (props: Props) => {
  const { hide } = props;
  function onClick(): void {
    hide();
  }

  return (
	<Button label="Download" onClick={onClick} wrapperClass="download-radar">
		<Icon iconType={IconType.Download} />
	</Button>
  );
};

export default Download;
