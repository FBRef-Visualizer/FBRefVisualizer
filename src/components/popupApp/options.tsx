import * as React from 'react';
import { FC, useContext, useState } from 'react';
import Icon, { IconType } from '../generic/icon';
import { AppContext } from './appContext';
import "./options.scss";
import { Actions } from './reducer';

const Options: FC = () => {
    const [compareClicked, setCompareClicked] = useState<boolean>(false);

    const {
        dispatch,
        state: {
            showRadar,
            hasData,
            canCompare
        }
    } = useContext(AppContext);

    if (!hasData) {
        return <p>No data</p>;
    }

    function launchChart(): void {
        dispatch({ type: Actions.ToggleRadar, showRadar: true });
    }

    function addCompare(): void {
        dispatch({ type: Actions.AddCurrentPlayerToCompare });
        setCompareClicked(true);
    }

    return (
        <div className="options">
            <button onClick={launchChart} disabled={showRadar}>
                <Icon iconType={showRadar ? IconType.Check : IconType.View} />
                <span className="label">
                    View Radar
                </span>
            </button>
            <button onClick={addCompare} disabled={!canCompare}>
                <Icon iconType={compareClicked ? IconType.Check : IconType.Compare} />
                <span className="label">
                    Add Compare
                </span>
            </button>
        </div>
    );
};

export default Options;