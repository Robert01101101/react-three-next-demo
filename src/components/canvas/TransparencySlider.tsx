interface TransparencySliderProps {
  opacity: number;
  setOpacity: (opacity: number) => void;
}

export function TransparencySlider({ opacity, setOpacity }: TransparencySliderProps) {
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(parseFloat(e.target.value));
  };

  return (
    <div>
      <label>Opacity: {opacity.toFixed(2)}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={handleOpacityChange}
      />
    </div>
  );
}