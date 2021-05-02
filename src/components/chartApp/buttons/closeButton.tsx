import * as React from 'react';
import { FC } from 'react';
import { Command } from '../../../types/message';
import Icon, { IconType } from '../../generic/icon';
import Button from './button';
import './closeButton.scss';

const Close: FC = () => {
  function onClick(): void {
    chrome.runtime.sendMessage({
      command: Command.Close
    });
  }

  return (
	<Button label="Close" onClick={onClick} wrapperClass="close-radar">
		<Icon iconType={IconType.Close} />
	</Button>
  );
};

export default Close;
