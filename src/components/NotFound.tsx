import { Link } from "@tanstack/react-router";

export function NotFound({ children }: { children?: any }) {
  return (
    <div className=" min-h-screen flex items-center justify-center">
      <div className="space-y-2 p-2">
        <div className="text-gray-600 dark:text-gray-400">
          {children || <p>The page you are looking for does not exist.</p>}
        </div>
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => window.history.back()}
            className="bg-emerald-500 text-white px-2 py-1 rounded-sm uppercase font-black text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
