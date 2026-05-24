'use client'

interface Props {
  value: string
  onChange: (url: string) => void
}

export default function ImageUpload({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="Image URL"
        className="w-full px-3 py-2 border rounded-lg text-sm"
      />
      {value && (
        <img src={value} alt="" className="max-h-40 rounded object-contain" />
      )}
    </div>
  )
}
