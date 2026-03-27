interface ClientProps {
  jobs: any[]; // This allows the 'jobs' array to be passed in
}

export const ClientView = ({ jobs }: ClientProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">
          Your <span className="text-purple-500">Job Posts</span>
        </h2>
      </div>
      
      {/* Existing job post button and list logic here */}
      <div className="p-12 border-2 border-dashed border-white/5 rounded-[40px] text-center text-gray-500">
        <p>Your dashboard is ready for recruitment.</p>
      </div>
    </div>
  );
};