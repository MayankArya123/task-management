export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {/* Tasks List */}
      <div className="w-full max-w-xl flex flex-col gap-3">
        
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white p-4 rounded shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-4 w-6 bg-gray-300 rounded"></div>
              <div className="h-4 w-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
