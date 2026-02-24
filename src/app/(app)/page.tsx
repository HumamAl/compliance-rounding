export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview and key metrics
        </p>
      </div>

      {/* TODO: Replace with app-specific dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Stat 1</p>
          <p className="text-2xl font-bold mt-1">--</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Stat 2</p>
          <p className="text-2xl font-bold mt-1">--</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Stat 3</p>
          <p className="text-2xl font-bold mt-1">--</p>
        </div>
      </div>
    </div>
  );
}
