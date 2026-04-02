function PageContainer({ title, children }) {
  return (
    <section className="space-y-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">{title}</h1>
      {children}
    </section>
  )
}

export default PageContainer
