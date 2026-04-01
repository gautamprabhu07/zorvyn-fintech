function PageContainer({ title, children }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">{title}</h1>
      {children}
    </main>
  )
}

export default PageContainer
