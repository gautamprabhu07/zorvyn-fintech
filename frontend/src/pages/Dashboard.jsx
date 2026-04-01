import PageContainer from '../components/PageContainer'

function Dashboard() {
  return (
    <PageContainer title="Dashboard">
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-700">Placeholder dashboard page. This route is protected.</p>
      </section>
    </PageContainer>
  )
}

export default Dashboard
