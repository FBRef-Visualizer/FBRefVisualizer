import * as React from 'react';
import { FC } from 'react';
import "./loading.scss";

interface Props {
    loading: boolean;
}

const Loading: FC<Props> = (props: Props) => {
    const { loading } = props;

    if (!loading) {
        return null;
    }

    return (
        <div className="loading">
            <span className="sr">Loading</span>
        </div>
    );
};

export default Loading;