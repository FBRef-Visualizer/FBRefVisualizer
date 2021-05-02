import * as React from 'react';
import { FC, useCallback } from 'react';

interface Props {
	name: string;
	dataUrl: string | null;
}

const Downloader: FC<Props> = (props: Props) => {
	const { name, dataUrl } = props;

	const anchorRef = useCallback((node: HTMLAnchorElement) => {
		if (node) {
			node.click();
		}
	}, []);

	if (dataUrl) {
		return (
			<a
				href={dataUrl}
				className="hidden-downloader"
				download={`${name}-radar.png`}
				ref={anchorRef}
			>
				Image
			</a>
		);
	}

	return null;
};

export default Downloader;
