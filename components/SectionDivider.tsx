interface SectionDividerProps {
  className?: string;
}

export default function SectionDivider({ className = "" }: SectionDividerProps) {
  return (
    <div className={`px-8 md:px-16 ${className}`}>
      <div className="h-px bg-[#E8E6E2] w-full" />
    </div>
  );
}
