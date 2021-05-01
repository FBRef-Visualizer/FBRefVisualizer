import { useEffect, useState } from 'react';
import { loadOptions } from '../helpers/chromeHelpers';
import { defaultOptions, Options } from '../types/options';

export default function useOptions(): { options: Options, loaded: boolean } {
    const [options, setOptions] = useState<Options>(defaultOptions);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        loadOptions((loaded) => {
            setOptions(loaded);
            setLoaded(true);
        });
    }, []);

    return { options, loaded };
}