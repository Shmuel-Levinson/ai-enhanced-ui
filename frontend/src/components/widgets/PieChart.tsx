import React, { useRef, useEffect } from 'react';

interface PieChartProps {
    data: any[];
    color: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !data) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match container size
        canvas.width = canvas.parentElement?.clientWidth || 200;
        canvas.height = canvas.parentElement?.clientHeight || 150;
    }, [data, color]);

    return (
        <div className="chart-container">
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default PieChart; 