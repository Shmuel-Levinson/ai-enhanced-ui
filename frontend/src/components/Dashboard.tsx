import React, { useState } from 'react';
import { Widget } from '../App';
import PieChart from './PieChart';
import BarGraph from './BarGraph';
import { TextWidget } from './TextWidget';

interface DashboardProps {
    currentTheme: any;
    widgets: Widget[];
    onAddWidget: (type: 'pie-chart' | 'bar-graph' | 'text', x: number, y: number, color?: string) => void;
    onRemoveWidget: (id: string) => void;
    onUpdateWidgets: (widgets: Widget[]) => void;
    transactions: any[];
    updateWidgetText: (id: string, newText: string) => void;
}

interface EmptySlot {
    x: number;
    y: number;
}

function Dashboard({ currentTheme, widgets, onAddWidget, onRemoveWidget, onUpdateWidgets, transactions, updateWidgetText }: DashboardProps) {
    const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [editingName, setEditingName] = useState<string | null>(null);

    // Define empty slots for 2x2 grid
    const emptySlots: EmptySlot[] = [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
    ];

    const generatePastelColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 90%)`; // High lightness for pastel effect
    };

    const handleAddWidget = (type: 'pie-chart' | 'bar-graph' | 'text') => {
        const newWidget = {
            id: Date.now().toString(),
            x: selectedSlot.x,
            y: selectedSlot.y,
            type,
            color: generatePastelColor(),
            name: `New ${type}`, // Add default name
        };
        setIsModalOpen(false);
        onAddWidget(type, selectedSlot.x, selectedSlot.y, newWidget.color);
    };

    const handleDragStart = (id: string) => {
        setDraggedWidget(id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetX: number, targetY: number) => {
        if (draggedWidget === null) return;

        const newWidgets = [...widgets];
        const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidget);
        
        if (!newWidgets.some(w => w.x === targetX && w.y === targetY)) {
            newWidgets[draggedIndex].x = targetX;
            newWidgets[draggedIndex].y = targetY;
        } else {
            const targetIndex = newWidgets.findIndex(w => w.x === targetX && w.y === targetY);
            const { x: tempX, y: tempY } = newWidgets[draggedIndex];
            newWidgets[draggedIndex].x = newWidgets[targetIndex].x;
            newWidgets[draggedIndex].y = newWidgets[targetIndex].y;
            newWidgets[targetIndex].x = tempX;
            newWidgets[targetIndex].y = tempY;
        }
        
        onUpdateWidgets(newWidgets);
        setDraggedWidget(null);
    };

    const handleGroupByChange = (widgetId: string, groupBy: 'category' | 'paymentMethod' | 'type') => {
        const newWidgets = widgets.map(widget => 
            widget.id === widgetId 
                ? { ...widget, groupBy }
                : widget
        );
        onUpdateWidgets(newWidgets);
    };

    const renderWidgetContent = (widget: Widget) => {
        const groupBySelector = widget.type === 'pie-chart' || widget.type === 'bar-graph' ? (
            <select
                value={widget.groupBy || 'category'}
                onChange={(e) => handleGroupByChange(widget.id, e.target.value as 'category' | 'paymentMethod' | 'type')}
                style={{
                    marginBottom: '10px',
                    padding: '5px',
                    borderRadius: '4px',
                    border: `1px solid ${currentTheme.border}`,
                    backgroundColor: currentTheme.surface2,
                    color: currentTheme.text,
                }}
            >
                <option value="category">By Category</option>
                <option value="paymentMethod">By Payment Method</option>
                <option value="type">By Type</option>
            </select>
        ) : null;

        switch (widget.type) {
            case 'pie-chart':
                return (
                    <div>
                        {groupBySelector}
                        <PieChart 
                            transactions={transactions} 
                            groupBy={widget.groupBy || 'category'} 
                        />
                    </div>
                );
            case 'bar-graph':
                return (
                    <div>
                        {groupBySelector}
                        <BarGraph 
                            transactions={transactions} 
                            groupBy={widget.groupBy || 'category'} 
                        />
                    </div>
                );
            case 'text':
                return <TextWidget text={widget.data.text} onTextChange={(newText:string) => updateWidgetText(widget.id, newText)} />;
            default:
                return null;
        }
    };

    return (
        <div style={{
            backgroundColor: currentTheme.surface,
            padding: "20px",
            borderRadius: "5px",
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '5px',
                aspectRatio: '2/2',
                maxWidth: '900px',
                width: '100%',
                margin: '10px auto',
            }}>
                {/* Render empty slots with plus symbols */}
                {emptySlots.map((slot) => {
                    const hasWidget = (widgets || []).some(w => w.x === slot.x && w.y === slot.y);
                    if (!hasWidget) {
                        return (
                            <div
                                key={`${slot.x}-${slot.y}`}
                                style={{
                                    backgroundColor: currentTheme.surface2 || '#f0f0f0',
                                    border: '2px dashed ' + (currentTheme.border || '#ddd'),
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gridColumn: slot.x,
                                    gridRow: slot.y,
                                }}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(slot.x, slot.y)}
                            >
                                <span
                                    style={{
                                        fontSize: '24px',
                                        opacity: 0.5,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        setSelectedSlot({ x: slot.x, y: slot.y });
                                        setIsModalOpen(true);
                                    }}
                                >
                                    ＋
                                </span>
                            </div>
                        );
                    }
                    return null;
                })}

                {/* Render widgets */}
                {widgets?.length && widgets.map((widget) => (
                    <div key={widget.id} 
                        style={{
                            backgroundColor: widget.color || currentTheme.surface2,
                            border: `2px solid ${currentTheme.border}`,
                            borderRadius: '8px',
                            padding: '15px',
                            gridColumn: widget.x,
                            gridRow: widget.y,
                            position: 'relative',
                        }}
                    >
                        <div
                            draggable
                            onDragStart={() => handleDragStart(widget.id)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(widget.x, widget.y)}
                            style={{
                                cursor: 'move',
                                height: '100%',
                            }}
                        >
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                }}
                                onClick={() => onRemoveWidget(widget.id)}
                            >
                                ✕
                            </span>
                            
                            {editingName === widget.id ? (
                                <input
                                    type="text"
                                    value={widget.name}
                                    onChange={(e) => {
                                        const newWidgets = widgets.map(w => 
                                            w.id === widget.id ? { ...w, name: e.target.value } : w
                                        );
                                        onUpdateWidgets(newWidgets);
                                    }}
                                    onBlur={() => setEditingName(null)}
                                    onKeyDown={(e) => e.key === 'Enter' && setEditingName(null)}
                                    autoFocus
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: '1.17em',
                                        fontWeight: 'bold',
                                        width: '80%',
                                        marginBottom: '10px',
                                    }}
                                />
                            ) : (
                                <h3 
                                    onClick={() => setEditingName(widget.id)}
                                    style={{
                                        margin: '0 0 10px 0',
                                        cursor: 'text',
                                        userSelect: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}
                                >
                                    <span>{widget.name}</span>
                                    <span style={{
                                        fontSize: '0.8em',
                                        color: currentTheme.textMuted || '#666',
                                        fontWeight: 'normal',
                                    }}>
                                        ({widget.x}, {widget.y})
                                    </span>
                                </h3>
                            )}
                            
                            {/* Widget content */}
                            {renderWidgetContent(widget)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Widget Selection Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div style={{
                        backgroundColor: currentTheme.surface,
                        padding: '20px',
                        borderRadius: '8px',
                        minWidth: '300px',
                    }}>
                        <h3>Select Widget Type</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={() => handleAddWidget('pie-chart')}>Pie Chart</button>
                            <button onClick={() => handleAddWidget('bar-graph')}>Bar Graph</button>
                            <button onClick={() => handleAddWidget('text')}>Text Widget</button>
                            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;