interface Props {
  searchParams: Promise<{ error?: string; from?: string }>;
}

export default async function POSLoginPage({ searchParams }: Props) {
  const { error, from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Proof of Wash</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Point of Sale</h1>
        </div>

        <form
          method="POST"
          action="/api/pos/login"
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5"
        >
          <input type="hidden" name="from" value={from ?? '/pos'} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Enter POS password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
              Incorrect password.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
