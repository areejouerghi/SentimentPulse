import { useEffect, useState } from "react";
import { fetchDashboard, fetchReviews, fetchMe, User } from "./api/client";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Dashboard } from "./components/Dashboard";
import { ReviewForm } from "./components/ReviewForm";
import { AdminDashboard } from "./components/AdminDashboard";
import { FormsManager } from "./components/FormsManager";
import { PublicReviewPage } from "./components/PublicReviewPage";
import { Pagination } from "./components/Pagination";

type Review = {
  id: number;
  content: string;
  sentiment: string;
  sentiment_score: number;
};

type DashboardSummary = {
  total_reviews: number;
  positive: number;
  neutral: number;
  negative: number;
  latest_reviews: Review[];
};

export default function App() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<"dashboard" | "admin" | "auth">("auth");
  const [authView, setAuthView] = useState<"login" | "register">("login");

  // Pagination State
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await fetchMe();
      setCurrentUser(user);
      setView("dashboard");
      refreshData();
    } catch {
      setView("auth");
    }
  };

  const refreshData = async () => {
    try {
      const [dashData, reviewsData] = await Promise.all([
        fetchDashboard(),
        fetchReviews(),
      ]);
      setSummary(dashData);
      setReviews(reviewsData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sp_token");
    setCurrentUser(null);
    setView("auth");
  };

  if (window.location.pathname.startsWith("/collect/")) {
    const uuid = window.location.pathname.split("/collect/")[1];
    return <PublicReviewPage uuid={uuid} />;
  }

  if (view === "auth") {
    return (
      <div className="auth-page">
        {authView === "login" ? (
          <LoginForm
            onSuccess={checkUser}
            onSwitch={() => setAuthView("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={() => setAuthView("login")}
            onSwitch={() => setAuthView("login")}
          />
        )}
      </div>
    );
  }

  // Calculate pagination
  const totalReviewPages = Math.ceil(reviews.length / itemsPerPage);
  const displayedReviews = reviews.slice(
    (currentReviewPage - 1) * itemsPerPage,
    currentReviewPage * itemsPerPage
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-title">
          <span>SentimentPulse</span>
          <span className="user-badge">{currentUser?.role}</span>
        </div>
        <div className="flex gap-2 items-center">
          {currentUser?.role === "admin" && (
            <button
              onClick={() => setView(view === "admin" ? "dashboard" : "admin")}
              className={`btn ${view === "admin" ? "btn-primary" : "btn-secondary"}`}
            >
              {view === "admin" ? "Voir Dashboard" : "Admin Panel"}
            </button>
          )}
          <button onClick={handleLogout} className="btn btn-secondary">
            Déconnexion
          </button>
        </div>
      </header>

      {view === "admin" ? (
        <AdminDashboard />
      ) : (
        <>
          {summary && <Dashboard summary={summary} reviews={reviews} />}

          <div className="grid grid-2">
            <div className="card">
              <h3>Ajouter un avis manuellement</h3>
              <ReviewForm onCreated={refreshData} />
            </div>

            <div className="card">
              <h3>Actions Rapides</h3>
              <p>Gérez vos formulaires et collectez des avis.</p>
              <FormsManager />
            </div>
          </div>

          <div className="card mt-4">
            <h3>Historique complet</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Sentiment</th>
                    <th>Score</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedReviews.map((review) => (
                    <tr key={review.id}>
                      <td>
                        <span className={`tag tag-${review.sentiment.toLowerCase()}`}>
                          {review.sentiment}
                        </span>
                      </td>
                      <td>{review.sentiment_score.toFixed(2)}</td>
                      <td>{review.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentReviewPage}
              totalPages={totalReviewPages}
              onPageChange={setCurrentReviewPage}
            />
          </div>
        </>
      )
      }
    </div >
  );
}
