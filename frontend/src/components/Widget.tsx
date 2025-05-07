import React from 'react';

interface WidgetProps {
    title: string;
    children?: React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({ title, children }) => {
    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '16px',
            height: 'calc(100% - 32px)',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
        }}>
            <div 
                className="widget-header"
                style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#333',
                    cursor: 'move',
                    userSelect: 'none'
                }}
            >
                {title}
            </div>
            <div style={{ 
                flex: 1,
                overflow: 'auto'
            }}>
                {children}
            </div>
        </div>
    );
};

export default Widget; 