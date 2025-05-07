import React from 'react';

const TableView = () => {
    // Example data - replace with your actual data
    const data = [
        { id: 1, name: 'Item 1', status: 'Active' },
        { id: 2, name: 'Item 2', status: 'Inactive' },
        { id: 3, name: 'Item 3', status: 'Active' },
    ];

    return (
        <div style={{
            padding: '20px',
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'auto',
        }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderRadius: '8px',
            }}>
                <thead>
                    <tr style={{
                        backgroundColor: '#f5f5f5',
                        borderBottom: '2px solid #e0e0e0',
                    }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr 
                            key={item.id} 
                            style={{
                                borderBottom: '1px solid #e0e0e0',
                                cursor: 'pointer',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                            }}
                        >
                            <td style={{ padding: '12px' }}>{item.id}</td>
                            <td style={{ padding: '12px' }}>{item.name}</td>
                            <td style={{ padding: '12px' }}>{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableView; 