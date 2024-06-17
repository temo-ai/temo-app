import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select';

interface MicSelectorProps {
  audioDevices: AudioDevice[];
  selectedMic: string;
  setSelectedMic: (mic: string) => void;
}

export const MicSelector = ({audioDevices, selectedMic, setSelectedMic}: MicSelectorProps) => (
  <Select
    onValueChange={() => {
      setSelectedMic(audioDevices[0].value);
    }}
    value={selectedMic}
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select Mic" />
    </SelectTrigger>
    <SelectContent>
      {audioDevices.map(device => (
        <SelectItem
          key={device.value}
          value={device.value}
        >
          {device.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
interface AudioDevice {
  label: string;
  value: string;
}
