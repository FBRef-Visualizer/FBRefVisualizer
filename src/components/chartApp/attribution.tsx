import * as React from 'react';
import { FC } from 'react';
import './attribution.scss';

const Attribution: FC = () => (
    <p className="attribution">
        <span>
            Data courtesy of
        </span>
        <a href="https://fbref.com/">
            <b>FB</b>Ref.com
        </a>
    </p>
);

export default Attribution;