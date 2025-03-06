import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Grid, Shuffle } from "lucide-react";

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

interface ColorGridProps {
  onSelect: (selection: { color: string; character: string; position: number }) => void;
  gridSize?: number;
}

export function ColorGrid({ onSelect, gridSize = 6 }: ColorGridProps) {
  const [grid, setGrid] = useState(() => generateGrid(gridSize));

  const shuffleGrid = useCallback(() => {
    setGrid(generateGrid(gridSize));
  }, [gridSize]);

  function generateGrid(size: number) {
    const chars = [...CHARS].sort(() => Math.random() - 0.5).slice(0, size * size);
    const colors = [...COLORS].sort(() => Math.random() - 0.5);
    
    return chars.map((char, idx) => ({
      char,
      color: colors[idx % colors.length],
      position: idx
    }));
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Grid className="h-5 w-5" />
          <span className="text-sm font-medium">Select characters in sequence</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={shuffleGrid}
          className="h-8 w-8"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        className="grid gap-2"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` 
        }}
      >
        {grid.map((item, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="aspect-square p-0 text-lg font-bold"
            style={{ 
              backgroundColor: item.color,
              color: ['yellow', 'orange'].includes(item.color) ? 'black' : 'white'
            }}
            onClick={() => {
              onSelect({
                color: item.color,
                character: item.char,
                position: item.position
              });
              shuffleGrid();
            }}
          >
            {item.char}
          </Button>
        ))}
      </div>
    </div>
  );
}
