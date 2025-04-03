const Loading = () => {
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm z-50 flex flex-col justify-center items-center text-center px-4">
      <div className="loader" />
      <div className="text-xl text-gray-200 font-semibold tracking-wider p-10">
      Login to see this page
      </div>
    </div>
  );
};

export default Loading;
