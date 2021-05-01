import * as React from 'react';
import { ChangeEvent, FC, useState } from 'react';
import { saveOptions } from '../../helpers/chromeHelpers';
import { Options, TimeFormat } from '../../types/options';
import Check from '../generic/check';
import './form.scss';

interface Props {
    defaultOptions: Options | null;
}

const TimeFormatOption: FC<Props> = ({ defaultOptions }: Props) => {
    const [format, setFormat] = useState<TimeFormat | null>(null);

    React.useEffect(() => {
        setFormat(defaultOptions?.timeFormat ?? null);
    }, [defaultOptions])

    function onChange(event: ChangeEvent<HTMLInputElement>): void {
        const timeFormat = parseInt(event.target.value) as TimeFormat;
        saveOptions({ timeFormat }, ({ timeFormat: newTimeFormat }) => {
            setFormat(newTimeFormat);
        });
    }

    if (format === null) {
        return null;
    }

    return (
        <fieldset>
            <legend>Time Format</legend>
            <div className="form-group inline">
                <Check checked={format === 12} onChange={() => setFormat(12)} />
                <label>
                    <input
                        type="radio"
                        name="time"
                        id="12"
                        value={12}
                        onChange={onChange}
                        checked={format === 12}
                    />
                    12 Hour Format
                </label>
            </div>
            <div className="form-group inline">
                <Check checked={format === 24} onChange={() => setFormat(24)} />
                <label>
                    <input
                        type="radio"
                        name="time"
                        id="24"
                        value={24}
                        onChange={onChange}
                        checked={format === 24}
                    />
                    24 Hour Format
                </label>
            </div>
        </fieldset>
    );
};

export default TimeFormatOption;