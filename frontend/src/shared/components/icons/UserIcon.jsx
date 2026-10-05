export default function UserIcon({
  width = 18,
  height = 18,
  size,
  color,
  stroke = 'currentColor',
  strokeWidth = 1.8,
  ...props
} = {}) {
  const finalWidth = size || width
  const finalHeight = size || height
  const finalStroke = color || stroke

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={finalWidth}
      height={finalHeight}
      viewBox="0 0 24 24"
      fill="none"
      stroke={finalStroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}