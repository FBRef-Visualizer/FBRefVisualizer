import * as React from 'react';
import { FC } from 'react';
import Compare from './compare';
import Loading from './loading';
import Options from './options';
import { Tab as TabEnum } from './reducer';
import Tab from './tab';
import Tabs from './tabs';

const Layout: FC = () => (
    <div className="popup">
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

export default Layout;