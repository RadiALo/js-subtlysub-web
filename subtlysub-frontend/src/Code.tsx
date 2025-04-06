const Code = () => {
  return (
    <div className="py-6 min-h-screen bg-gray-800 flex flex-col items-center">
      <h1 className="text-white text-3xl font-bold tracking-wide mb-8">
        SubtlySub
      </h1>

      <div className="w-full max-w-md p-8 space-y-6 bg-gray-200 shadow-2xl rounded-2xl">
        <p className="text-gray-700 text-lg font-semibold">Your verification code</p>

        <div className="w-full bg-purple-500 text-white text-3xl font-mono text-center py-4 rounded-xl tracking-widest">
          123456
        </div>

        <p className="text-gray-600 text-sm">
          Please enter this code in the app to verify your email address. 
          This code will expire in 60 minutes.
        </p>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">If you didn't request this, you can ignore this email.</p>
        </div>
      </div>
    </div>
  )
};

export default Code;