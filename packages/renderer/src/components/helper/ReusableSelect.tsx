import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select';

type SelectProps = {
  options: {label: string; value: string}[];
  value?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function ReusableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
}: SelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className={`w-[180px]`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map(option => (
          <SelectItem
            key={option?.value}
            value={option?.value}
          >
            {option?.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
