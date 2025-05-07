import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';
import TableView from './components/TableView';
import NavButton from './components/NavButton';

type Props = {};

function renderNavBar(setActiveTab: (value: (((prevState: ("dashboard" | "table")) => ("dashboard" | "table")) | "dashboard" | "table")) => void, activeTab: "dashboard" | "table") {
    return (
        <div style={{
            display: 'flex',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0',
            padding: '0 20px',
        }}>
            <NavButton
                label="Dashboard"
                isActive={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
            />
            <NavButton
                label="Table View"
                isActive={activeTab === 'table'}
                onClick={() => setActiveTab('table')}
            />
        </div>
    );
}

export default function App(props: Props) {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'table'>('dashboard');
    const [messageInput, setMessageInput] = useState<string>('');

    return (
        <div style={{display: "flex", flexDirection: "column", height: "100vh", border:"0px solid gold"}}>
            {renderNavBar(setActiveTab, activeTab)}

            {/* Main Content */}
            <div style={{display: "flex",gap: 20, height:"100%"}}>
                <div style={{
                    flex: 1,
                    height: '100%',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    {activeTab === 'dashboard' ? <Dashboard/> : <TableView/>}
                </div>

                <div style={{width: "350px", height:"100%", margin: 0, padding: 0, border:"0px solid red"}}>
                    <Chatbot
                        messages={[]}
                        isTyping={false}
                        onSubmit={() => {
                        }}
                        inputText={messageInput}
                        setInputText={setMessageInput}
                        onReset={() => {
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
