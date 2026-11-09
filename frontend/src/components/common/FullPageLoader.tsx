const FullPageLoader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-[#080808]"
    >
      <span className="sr-only">Loading</span>
      <div className="size-10 animate-spin rounded-full border-2 border-neutral-700 border-t-orange-500" />
    </div>
  );
};

export default FullPageLoader;
