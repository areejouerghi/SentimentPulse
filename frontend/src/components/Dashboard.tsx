import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"]; // Green, Yellow, Red

type DashboardData = {
  total_reviews: number;
  positive: number;
  neutral: number;
  negative: number;
  latest_reviews: Array<{
    id: number;
    content: string;
    sentiment: string;
    sentiment_score: number;
  }>;
};

interface Props {
  summary: DashboardData;
  reviews: DashboardData["latest_reviews"];
}

export function Dashboard({ summary, reviews }: Props) {
  if (!summary) {
    return <p>Chargement du dashboard...</p>;
  }

  const chartData = [
    { name: "Positif", value: summary.positive },
    { name: "Neutre", value: summary.neutral },
    { name: "Négatif", value: summary.negative },
  ];

  return (
    <div className="grid grid-2">
      <div className="card">
        <h3>Tendance sentiments</h3>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                innerRadius={60}
                paddingAngle={5}

              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-4 text-sm">
          <div>Total: <strong>{summary.total_reviews}</strong></div>
          <div className="flex gap-2">
            <span style={{ color: COLORS[0] }}>Pos: {summary.positive}</span>
            <span style={{ color: COLORS[1] }}>Neu: {summary.neutral}</span>
            <span style={{ color: COLORS[2] }}>Neg: {summary.negative}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Derniers avis</h3>
        {reviews.slice(0, 5).map((review) => (
          <div key={review.id} className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className={`tag tag-${review.sentiment.toLowerCase()}`}>{review.sentiment}</span>
              <span className="text-sm text-muted">{review.sentiment_score.toFixed(2)}</span>
            </div>
            <p className="text-sm" style={{ margin: 0 }}>{review.content.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
