const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full py-20">
      <div className="loader mb-6" />
      <div className="text-xl text-red-500 font-semibold tracking-wider animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default Loading;
