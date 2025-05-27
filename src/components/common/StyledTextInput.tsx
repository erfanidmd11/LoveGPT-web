import React from 'react';

type Props = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  style?: React.CSSProperties;
};

const StyledTextInput: React.FC<Props> = ({
  placeholder,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  style,
}) => {
  const Component = multiline ? 'textarea' : 'input';

  return (
    <Component
      placeholder={placeholder}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onChangeText(e.target.value)
      }
      rows={numberOfLines}
      className="w-full border border-gray-300 rounded-xl p-4 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
      style={style}
    />
  );
};

export default StyledTextInput;
