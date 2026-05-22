type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  emoji?: string;
};

export function EmptyState({ title, description, action, emoji = "🌱" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
