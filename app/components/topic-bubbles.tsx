import React, { useRef, useEffect } from 'react';

// @ts-ignore
import * as d3 from 'd3';

interface Topic {
  name: string;
  sermonCount: number;
}

export interface TopicListProps {
  topics: Topic[];
}

export const TopicBubbles = ({ topics }: TopicListProps) => {
  const svgRef = useRef(null);

  const maxSermonCount = Math.max(...topics.map((topic) => topic.sermonCount));
  const minSermonCount = Math.min(...topics.map((topic) => topic.sermonCount));

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const updateChart = () => {
      if (!topics || topics.length === 0 || !svgRef.current) return;

      const width = svg.node().getBoundingClientRect().width;
      const height = svg.node().getBoundingClientRect().height;

      const root = d3
        .hierarchy({ children: topics })
        .sum((d: Topic) => d.sermonCount)
        .sort((a: any, b: any) => b.value - a.value);

      const pack = d3.pack().size([width, height]).padding(1.5);
      pack(root);

      const opacityScale = d3
        .scaleLinear()
        .domain([minSermonCount, maxSermonCount])
        .range([0.6, 1]);

      // Data join
      const bubbles = svg
        .selectAll('.topic-bubble')
        .data(root.leaves(), (d: any) => d.data.name);

      // Enter selection
      const bubblesEnter = bubbles
        .enter()
        .append('a') // Append <a> directly
        .attr('href', (d: any) => `/topics/${d.data.name.toLowerCase()}`)
        .attr('key', (d: any) => d.data.name)
        .attr('class', 'topic-bubble')
        .append('g'); // Append <g> to the <a>

      bubblesEnter
        .append('circle')
        .attr('fill', '#908F51')
        .attr('opacity', (d: any) => opacityScale(d.data.sermonCount));

      bubblesEnter
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .style('fill', 'white')
        .attr('font-family', 'Verdana');

      // Update selection
      const bubblesUpdate = bubblesEnter.merge(bubbles);

      bubblesUpdate
        .select('g')
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`); // Apply transform to the <g>

      bubblesUpdate.select('circle').attr('r', (d) => d.r);

      bubblesUpdate
        .select('text')
        .text((d: any) => d.data.name)
        .style('font-size', (d: any) => {
          const baseSize = 2 * d.r;
          const lengthAdjustment = Math.max(0, d.data.name.length - 1);
          const fontSize = Math.min(baseSize, baseSize / lengthAdjustment);
          return Math.max(10, fontSize) + 'px';
        });

      // Exit selection
      bubbles.exit().remove();
    };

    // Initial chart rendering
    updateChart();

    // Resize observer for responsiveness
    const resizeObserver = new ResizeObserver(() => {
      updateChart();
    });
    // @ts-ignore
    resizeObserver.observe(svgRef.current);

    // Clean up the observer on unmount
    return () => resizeObserver.disconnect();
  }, [topics]);

  return (
    <div className="w-full h-[40rem] p-4">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
