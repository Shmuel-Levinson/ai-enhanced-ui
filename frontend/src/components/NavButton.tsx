import React from 'react';

interface NavButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: isActive ? '#fff' : 'transparent',
                borderBottom: isActive ? '2px solid #1976d2' : 'none',
                cursor: 'pointer',
                color: isActive ? '#1976d2' : '#666',
                fontWeight: isActive ? 'bold' : 'normal',
                outline: 'none',
            }}
        >
            {label}
        </button>
    );
};

export default NavButton; 