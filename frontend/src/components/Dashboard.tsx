import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from './Widget';

const Dashboard = () => {
    const [layout, setLayout] = useState([
        { i: 'widget1', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
        { i: 'widget2', x: 4, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
        { i: 'widget3', x: 0, y: 2, w: 6, h: 2, minW: 2, minH: 2 },
    ]);

    const onLayoutChange = (newLayout: any) => {
        setLayout(newLayout);
    };

    return (
        <div style={{
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
        }}>
            <style>
                {`
                    .react-grid-placeholder {
                        background: #eeeeee !important;
                        border: 2px none #bdbdbd !important;
                        opacity: 0.8 !important;
                        border-radius: 8px !important;
                    }
                `}
            </style>
            <GridLayout
                className="layout"
                layout={layout}
                cols={8}
                rowHeight={100}
                width={window.innerWidth - 400}
                onLayoutChange={onLayoutChange}
                draggableHandle=".widget-header"
                margin={[16, 16]}
                containerPadding={[10, 10]}
                isDraggable={true}
                isResizable={true}
                preventCollision={false}
                compactType={null}
                useCSSTransforms={true}
                allowOverlap={true}
            >
                <div key="widget1" style={{ zIndex: 1 }}>
                    <Widget title="Widget 1">
                        <div>This is widget 1 content</div>
                    </Widget>
                </div>
                <div key="widget2" style={{ zIndex: 1 }}>
                    <Widget title="Widget 2">
                        <div>This is widget 2 content</div>
                    </Widget>
                </div>
                <div key="widget3" style={{ zIndex: 1 }}>
                    <Widget title="Widget 3">
                        <div>This is widget 3 content</div>
                    </Widget>
                </div>
            </GridLayout>
        </div>
    );
};

export default Dashboard; 