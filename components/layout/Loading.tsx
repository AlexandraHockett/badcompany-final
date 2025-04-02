export default function Loading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-spin blur-[1px] shadow-[0px_-5px_20px_0px_rgb(186_66_255),0px_5px_20px_0px_rgb(0_225_255)]">
        <div className="w-full h-full bg-gray-800 rounded-full blur-[10px]"></div>
      </div>
    </div>
  );
}
