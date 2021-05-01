import * as React from 'react';
import { FC, useContext } from 'react';
import { AppContext } from './appContext';
import Compare from './compare/compare';
import Loading from './loading';
import NoFbRef from './noFbRef';
import Options from './options';
import { Tab as TabEnum } from './reducer';
import Tab from './tab';
import Tabs from './tabs';

const Layout: FC = () => {
    const { state: { isOnFbRef } } = useContext(AppContext);

    return (
        <div className={`popup ${isOnFbRef ? 'on-fb-ref' : 'not-on-fbref'}`}>
            <NoFbRef />
            <Tabs>
                <Tab tab={TabEnum.Player}>
                    <Loading />
                    <Options />
                </Tab>
                <Tab tab={TabEnum.Compare}>
                    <Compare />
                </Tab>
            </Tabs>
        </div>
    );
};

export default Layout;