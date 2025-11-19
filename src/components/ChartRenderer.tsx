import { useEffect, useRef } from 'react';
import embed from 'vega-embed';

interface ChartRendererProps {
    spec: any;
}

export const ChartRenderer = ({ spec }: ChartRendererProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log('🎨 ChartRenderer mounted with spec:', spec);
        if (containerRef.current && spec) {
            console.log('🎨 Container found, embedding chart...');
            embed(containerRef.current, spec, { actions: false })
                .then(() => console.log('✅ Chart embedded successfully'))
                .catch((err) => console.error('❌ Chart embed error:', err));
        } else {
            console.warn('⚠️ No container or spec', { hasContainer: !!containerRef.current, hasSpec: !!spec });
        }
    }, [spec]);

    return <div ref={containerRef} className="chart-container" style={{ minHeight: '400px', width: '100%', border: '1px solid #ccc' }} />;
};
