type Props = {
  label: string;
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputWithLabel = ({ label, value, handleChange }: Props) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm" htmlFor="gap">
        {label}
      </label>
      <input
        className="border p-1"
        type="number"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default InputWithLabel;
